import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Star,
  ShieldCheck,
  Truck,
  Plus,
  X,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { seedsDataset } from "../data/mockData";
import { SeedItem } from "../types";

export function SeedsShopPage() {
  const [items] = useState<SeedItem[]>(seedsDataset);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [certifiedOnly, setCertifiedOnly] = useState(false);
  const [aiSuggestedOnly, setAiSuggestedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"popular" | "discount" | "priceAsc" | "priceDesc">("popular");

  // Cart
  const [cart, setCart] = useState<
    Array<{
      seed: SeedItem;
      quantity: number;
    }>
  >([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Address
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    phone: "",
    village: "",
    pincode: "",
    paymentMethod: "cod",
  });

  const categories = [
    { id: "all", label: "All Seeds" },
    { id: "cereal", label: "Cereals & Grains" },
    { id: "vegetable", label: "Vegetables" },
    { id: "oilseed", label: "Oilseeds" },
    { id: "pulse", label: "Pulses & Legumes" },
    { id: "cash", label: "Cash Crops" },
    { id: "spice", label: "Spices" },
  ];

  const getPrice = (s: SeedItem) => s.price || s.pricePerKg || 120;
  const getOriginalPrice = (s: SeedItem) => s.originalPrice || Math.round(getPrice(s) * 1.25);
  const getDiscount = (s: SeedItem) => {
    if (s.discount) return s.discount;
    const p = getPrice(s);
    const op = getOriginalPrice(s);
    return Math.max(5, Math.round(((op - p) / op) * 100));
  };
  const getPackSize = (s: SeedItem) => {
    if (s.packSize) return s.packSize;
    if (s.packSizes && s.packSizes.length > 0) return `${s.packSizes[0]} kg`;
    return "1 kg";
  };
  const getImage = (s: SeedItem) => {
    return s.imageUrl || s.image || "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600";
  };

  const filtered = items
    .filter((s) => {
      const matchCat =
        category === "all" ||
        s.category?.toLowerCase() === category.toLowerCase() ||
        s.category?.toLowerCase().includes(category.toLowerCase());
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.variety.toLowerCase().includes(search.toLowerCase()) ||
        s.brand.toLowerCase().includes(search.toLowerCase());
      const matchCert = !certifiedOnly || s.certified;
      const matchAi = !aiSuggestedOnly || s.aiSuggested || s.aiRecommended;
      return matchCat && matchSearch && matchCert && matchAi;
    })
    .sort((a, b) => {
      if (sortBy === "popular") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "discount") return getDiscount(b) - getDiscount(a);
      if (sortBy === "priceAsc") return getPrice(a) - getPrice(b);
      if (sortBy === "priceDesc") return getPrice(b) - getPrice(a);
      return 0;
    });

  const addToCart = (seed: SeedItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.seed.id === seed.id);
      if (existing) {
        return prev.map((item) =>
          item.seed.id === seed.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { seed, quantity: 1 }];
    });
    toast.success(`Added ${seed.name} to cart!`);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.seed.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as any
    );
  };

  const totalItemsCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const cartSubtotal = cart.reduce((acc, curr) => acc + getPrice(curr.seed) * curr.quantity, 0);
  const originalSubtotal = cart.reduce(
    (acc, curr) => acc + getOriginalPrice(curr.seed) * curr.quantity,
    0
  );
  const totalSavings = Math.round(originalSubtotal - cartSubtotal);

  const handlePlaceOrder = (e: FormEvent) => {
    e.preventDefault();
    if (!checkoutForm.name || !checkoutForm.phone || !checkoutForm.village) {
      toast.error("Please provide your delivery details.");
      return;
    }

    setOrderPlaced(true);
    setCart([]);
    setCheckoutOpen(false);
    toast.success("Order placed successfully! Seeds will be delivered in 3–5 days.");
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6 relative">
      {/* Checkout Modal */}
      <AnimatePresence>
        {checkoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCheckoutOpen(false)}
            />
            <motion.div
              className="relative w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl z-10 space-y-4"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-lg font-display">Farm Delivery Details</h3>
                </div>
                <button
                  onClick={() => setCheckoutOpen(false)}
                  className="p-1 rounded-lg text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handlePlaceOrder} className="space-y-3 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Farmer Name *</label>
                  <Input
                    placeholder="Full name"
                    value={checkoutForm.name}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Mobile Number *</label>
                  <Input
                    placeholder="10-digit mobile number"
                    value={checkoutForm.phone}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">
                      Village / Post Office *
                    </label>
                    <Input
                      placeholder="Village name"
                      value={checkoutForm.village}
                      onChange={(e) =>
                        setCheckoutForm({ ...checkoutForm, village: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Pincode</label>
                    <Input
                      placeholder="e.g. 422001"
                      value={checkoutForm.pincode}
                      onChange={(e) =>
                        setCheckoutForm({ ...checkoutForm, pincode: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-semibold text-foreground">Payment Method</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div
                      onClick={() => setCheckoutForm({ ...checkoutForm, paymentMethod: "cod" })}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        checkoutForm.paymentMethod === "cod"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <p className="font-bold">Cash on Delivery</p>
                      <p className="text-[10px] text-muted-foreground">Pay after seed inspection</p>
                    </div>

                    <div
                      onClick={() => setCheckoutForm({ ...checkoutForm, paymentMethod: "upi" })}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        checkoutForm.paymentMethod === "upi"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <p className="font-bold">UPI / QR at Delivery</p>
                      <p className="text-[10px] text-muted-foreground">GPay, PhonePe, Paytm</p>
                    </div>
                  </div>
                </div>

                {/* Amount to pay */}
                <div className="p-3 rounded-xl bg-muted/50 border border-border flex items-center justify-between text-xs mt-3">
                  <span>Payable Amount:</span>
                  <span className="font-extrabold text-base text-primary font-display">
                    ₹{cartSubtotal.toLocaleString()}
                  </span>
                </div>

                <Button type="submit" className="w-full cursor-pointer h-10 mt-2 font-semibold">
                  Place Order with Guaranteed Delivery
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              className="relative w-full max-w-md bg-card border-l border-border h-full p-6 shadow-2xl z-10 flex flex-col justify-between"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-lg font-display">Your Seed Cart</h3>
                  </div>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="p-1 rounded-lg text-muted-foreground hover:bg-muted cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Cart Items List */}
                <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto pr-1">
                  {cart.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground text-sm">
                      Your cart is empty. Browse certified varieties and add them here!
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.seed.id}
                        className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/40 border border-border"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate text-foreground font-display">
                            {item.seed.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            ₹{getPrice(item.seed)} / pack ({getPackSize(item.seed)})
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.seed.id, -1)}
                            className="w-7 h-7 rounded-md border border-input flex items-center justify-center hover:bg-muted text-xs font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.seed.id, 1)}
                            className="w-7 h-7 rounded-md border border-input flex items-center justify-center hover:bg-muted text-xs font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right min-w-[65px]">
                          <p className="font-bold text-xs text-foreground">
                            ₹{(getPrice(item.seed) * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Cart Summary */}
              {cart.length > 0 && (
                <div className="pt-4 border-t border-border space-y-3">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal:</span>
                      <span>₹{originalSubtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                      <span>Cooperative Subsidy Savings:</span>
                      <span>-₹{totalSavings.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        FREE
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-base text-foreground pt-2 border-t border-border">
                      <span>Final Total:</span>
                      <span className="text-primary font-display">
                        ₹{cartSubtotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full cursor-pointer h-11 text-base font-semibold gap-2"
                    onClick={() => {
                      setCartOpen(false);
                      setCheckoutOpen(true);
                    }}
                  >
                    Proceed to Checkout ({totalItemsCount} Items)
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display">
            Certified Seeds & Inputs Shop
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            High-germination, disease-resistant seeds certified by State Ag Universities at cooperative
            discount prices.
          </p>
        </div>

        {/* Floating Cart Trigger */}
        <Button
          onClick={() => setCartOpen(true)}
          className="relative cursor-pointer gap-2 font-semibold"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Cart</span>
          {totalItemsCount > 0 && (
            <span className="bg-white text-primary rounded-full px-2 py-0.5 text-xs font-bold shadow-xs">
              {totalItemsCount}
            </span>
          )}
        </Button>
      </motion.div>

      {/* Order confirmation banner if just placed */}
      <AnimatePresence>
        {orderPlaced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="font-bold text-sm text-emerald-900 dark:text-emerald-200 font-display">
                  Order Successfully Placed!
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  Tracking SMS sent. Seeds dispatched from nearest district seed warehouse.
                </p>
              </div>
            </div>
            <button
              onClick={() => setOrderPlaced(false)}
              className="text-emerald-700 hover:text-emerald-900 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search variety, seed brand, crop…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setAiSuggestedOnly(!aiSuggestedOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                aiSuggestedOnly
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/50 border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> AI Recommended
            </button>

            <button
              onClick={() => setCertifiedOnly(!certifiedOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                certifiedOnly
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-muted/50 border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Certified Only
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-9 rounded-lg border border-input bg-background px-2.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="discount">Highest Discount</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category horizontal tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 select-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all cursor-pointer ${
                category === cat.id
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((seed, idx) => {
          const price = getPrice(seed);
          const origPrice = getOriginalPrice(seed);
          const discount = getDiscount(seed);
          const packSize = getPackSize(seed);
          const isAi = seed.aiSuggested || seed.aiRecommended;

          return (
            <motion.div
              key={seed.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <Card className="h-full flex flex-col justify-between overflow-hidden hover:border-primary/50 transition-all group">
                <div>
                  {/* Image */}
                  <div className="relative h-40 w-full bg-muted overflow-hidden">
                    <img
                      src={getImage(seed)}
                      alt={seed.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600";
                      }}
                    />
                    {discount > 0 && (
                      <div className="absolute top-2.5 left-2.5 bg-red-600 text-white font-extrabold text-[11px] px-2 py-0.5 rounded-md shadow-md">
                        {discount}% OFF
                      </div>
                    )}
                    {isAi && (
                      <div className="absolute top-2.5 right-2.5 bg-primary text-primary-foreground font-semibold text-[10px] px-2 py-0.5 rounded-md shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Best Match
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4 space-y-2.5">
                    <div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-semibold text-primary uppercase text-[10px] tracking-wider">
                          {seed.category}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 font-semibold text-xs">
                          <Star className="w-3 h-3 fill-amber-500" />
                          <span>{seed.rating}</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-base font-display text-foreground mt-0.5 leading-snug">
                        {seed.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Variety: {seed.variety} • Brand: {seed.brand}
                      </p>
                    </div>

                    {/* Badges and germination specs */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] text-muted-foreground">
                      <div className="p-1.5 rounded-md bg-muted/50">
                        Germination: <strong className="text-foreground">{seed.germinationRate}%</strong>
                      </div>
                      <div className="p-1.5 rounded-md bg-muted/50">
                        Maturity: <strong className="text-foreground">{seed.maturityDays}d</strong>
                      </div>
                    </div>
                  </CardContent>
                </div>

                {/* Price & Add to Cart */}
                <div className="p-4 pt-0 border-t border-border/60 mt-2 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-extrabold text-foreground font-display">
                        ₹{price}
                      </span>
                      {origPrice > price && (
                        <span className="text-xs text-muted-foreground line-through">
                          ₹{origPrice}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground">Pack: {packSize}</span>
                  </div>

                  <Button
                    size="sm"
                    className="cursor-pointer gap-1.5 text-xs font-semibold"
                    onClick={() => addToCart(seed)}
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

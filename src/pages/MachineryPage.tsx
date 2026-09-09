import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Tractor,
  Search,
  SlidersHorizontal,
  MapPin,
  Star,
  ShieldCheck,
  Calendar,
  Clock,
  Plus,
  X,
  CheckCircle2,
  Tag,
  Fuel,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import { machineryDataset } from "../data/mockData";
import { MachineryItem } from "../types";

export function MachineryPage() {
  const [machines, setMachines] = useState<MachineryItem[]>(machineryDataset);
  const [tab, setTab] = useState<"browse" | "list" | "bookings">("browse");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"distance" | "priceAsc" | "priceDesc" | "rating">("distance");

  // Booking Modal
  const [selectedMachine, setSelectedMachine] = useState<MachineryItem | null>(null);
  const [bookingDays, setBookingDays] = useState(2);
  const [includeDriver, setIncludeDriver] = useState(true);
  const [myBookings, setMyBookings] = useState<
    Array<{
      id: string;
      machineName: string;
      days: number;
      total: number;
      date: string;
      status: string;
    }>
  >([]);

  // List Machine Form
  const [listForm, setListForm] = useState({
    title: "",
    category: "Tractors",
    pricePerDay: "",
    hp: "",
    location: "",
    phone: "",
  });

  const categories = [
    { id: "all", label: "All Equipment" },
    { id: "Tractors", label: "Tractors" },
    { id: "Harvesters", label: "Harvesters" },
    { id: "Sprayers", label: "Sprayers" },
    { id: "Drones", label: "Drones" },
    { id: "Pumps", label: "Water Pumps" },
    { id: "Threshers", label: "Threshers" },
  ];

  const filtered = machines
    .filter((m) => {
      const matchCat = categoryFilter === "all" || m.category === categoryFilter;
      const matchQuery =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.specs.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchQuery;
    })
    .sort((a, b) => {
      if (sortBy === "distance") return a.distanceKm - b.distanceKm;
      if (sortBy === "priceAsc") return a.pricePerDay - b.pricePerDay;
      if (sortBy === "priceDesc") return b.pricePerDay - a.pricePerDay;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const handleConfirmBooking = () => {
    if (!selectedMachine) return;
    const driverFee = includeDriver ? 500 * bookingDays : 0;
    const total = selectedMachine.pricePerDay * bookingDays + driverFee;

    const newBooking = {
      id: String(Date.now()),
      machineName: selectedMachine.name,
      days: bookingDays,
      total,
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      status: "Confirmed",
    };

    setMyBookings([newBooking, ...myBookings]);
    toast.success(`Booking confirmed for ${selectedMachine.name}! Owner notified.`);
    setSelectedMachine(null);
  };

  const handleListSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!listForm.title || !listForm.pricePerDay) {
      toast.error("Please fill in equipment name and price.");
      return;
    }

    const newItem: MachineryItem = {
      id: `mach-${Date.now()}`,
      name: listForm.title,
      category: listForm.category,
      pricePerDay: parseInt(listForm.pricePerDay, 10),
      pricePerHour: Math.round(parseInt(listForm.pricePerDay, 10) / 8),
      distanceKm: 2.5,
      rating: 5.0,
      reviewsCount: 1,
      available: true,
      owner: "You (Verified)",
      verified: true,
      specs: [
        { label: "Engine", value: listForm.hp ? `${listForm.hp} HP` : "Standard Spec" },
        { label: "Fuel", value: "Diesel" },
        { label: "Type", value: "Owner Managed" },
      ],
      imageUrl:
        "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
      location: listForm.location || "Nearby Farm",
    };

    setMachines([newItem, ...machines]);
    toast.success("Equipment listed on AgriShield Machinery Hub!");
    setListForm({ title: "", category: "Tractors", pricePerDay: "", hp: "", location: "", phone: "" });
    setTab("browse");
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      {/* Booking Modal */}
      <AnimatePresence>
        {selectedMachine && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMachine(null)}
            />
            <motion.div
              className="relative w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl z-10 space-y-4"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <Tractor className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-lg font-display">Book Equipment</h3>
                </div>
                <button
                  onClick={() => setSelectedMachine(null)}
                  className="p-1 rounded-lg text-muted-foreground hover:bg-muted"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <p className="font-bold text-base text-foreground font-display">
                  {selectedMachine.name}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" /> {selectedMachine.location} • {selectedMachine.distanceKm} km away
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Duration (Days)</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setBookingDays(Math.max(1, bookingDays - 1))}
                      className="w-10 h-10 rounded-lg border border-input flex items-center justify-center font-bold text-lg hover:bg-muted cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-lg font-bold w-12 text-center">{bookingDays}</span>
                    <button
                      type="button"
                      onClick={() => setBookingDays(bookingDays + 1)}
                      className="w-10 h-10 rounded-lg border border-input flex items-center justify-center font-bold text-lg hover:bg-muted cursor-pointer"
                    >
                      +
                    </button>
                    <span className="text-xs text-muted-foreground ml-auto">
                      ₹{selectedMachine.pricePerDay} / day
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border text-xs">
                  <div>
                    <p className="font-semibold text-foreground">Include Certified Driver / Operator?</p>
                    <p className="text-muted-foreground text-[11px]">+₹500 / day field operator fee</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeDriver}
                    onChange={(e) => setIncludeDriver(e.target.checked)}
                    className="w-4 h-4 rounded cursor-pointer text-primary"
                  />
                </div>

                {/* Price summary */}
                <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-1 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Machine Rental ({bookingDays} days):</span>
                    <span>₹{(selectedMachine.pricePerDay * bookingDays).toLocaleString()}</span>
                  </div>
                  {includeDriver && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Operator Fee ({bookingDays} days):</span>
                      <span>₹{(500 * bookingDays).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-sm text-foreground pt-2 border-t border-border/60">
                    <span>Total Amount:</span>
                    <span className="text-primary font-display">
                      ₹
                      {(
                        selectedMachine.pricePerDay * bookingDays +
                        (includeDriver ? 500 * bookingDays : 0)
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setSelectedMachine(null)}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmBooking} className="gap-1.5 cursor-pointer">
                  <CheckCircle2 className="w-4 h-4" /> Confirm & Book
                </Button>
              </div>
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
          <h1 className="text-2xl sm:text-3xl font-bold font-display">Machinery Sharing Hub</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Rent high-value tractors, harvesters, and spray drones from nearby verified farmers at 60%
            lower rates than commercial dealerships.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border">
          <button
            onClick={() => setTab("browse")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              tab === "browse" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
            }`}
          >
            Browse ({machines.length})
          </button>
          <button
            onClick={() => setTab("list")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              tab === "list" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
            }`}
          >
            + List Machine
          </button>
          <button
            onClick={() => setTab("bookings")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              tab === "bookings" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
            }`}
          >
            My Bookings ({myBookings.length})
          </button>
        </div>
      </motion.div>

      {/* Tab: Browse */}
      {tab === "browse" && (
        <div className="space-y-4">
          {/* Filters and search row */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search by equipment, spec, or village…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium shrink-0">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-10 rounded-lg border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              >
                <option value="distance">Nearest First</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 select-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all cursor-pointer ${
                  categoryFilter === cat.id
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="h-full flex flex-col justify-between overflow-hidden hover:border-primary/50 transition-all group">
                  <div>
                    {/* Image */}
                    <div className="relative h-44 w-full bg-muted overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600";
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        <Badge
                          variant={item.available ? "success" : "secondary"}
                          className="shadow-md"
                        >
                          {item.available ? "Available Now" : "Currently Booked"}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{item.rating}</span>
                        <span className="text-muted-foreground text-[10px]">
                          ({item.reviewsCount})
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-4 space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                            {item.category}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {item.distanceKm} km away
                          </span>
                        </div>
                        <h3 className="text-base font-bold font-display text-foreground mt-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Owner: {item.owner}{" "}
                          {item.verified && (
                            <ShieldCheck className="w-3 h-3 text-primary inline ml-0.5" />
                          )}
                        </p>
                      </div>

                      {/* Specs */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.specs.map((sp, sIdx) => {
                          const text = typeof sp === "string" ? sp : `${sp.label}: ${sp.value}`;
                          return (
                            <span
                              key={sIdx}
                              className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium"
                            >
                              {text}
                            </span>
                          );
                        })}
                      </div>

                    </CardContent>
                  </div>

                  {/* Footer Price & Book */}
                  <div className="p-4 pt-0 border-t border-border/60 mt-3 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-muted-foreground">Daily Rate</p>
                      <p className="text-lg font-extrabold text-foreground font-display">
                        ₹{item.pricePerDay}
                        <span className="text-xs font-normal text-muted-foreground">/day</span>
                      </p>
                    </div>

                    <Button
                      size="sm"
                      className="cursor-pointer font-semibold gap-1"
                      disabled={!item.available}
                      onClick={() => setSelectedMachine(item)}
                    >
                      Book Now
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: List Machine */}
      {tab === "list" && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" /> List Your Equipment for Rent
            </CardTitle>
            <CardDescription>
              Earn ₹15,000–₹40,000 per month by sharing your idle machinery with verified community
              farmers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleListSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Equipment Name & Model *</label>
                <Input
                  placeholder="e.g. Mahindra 575 DI 45 HP Tractor"
                  value={listForm.title}
                  onChange={(e) => setListForm({ ...listForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Category *</label>
                  <select
                    value={listForm.category}
                    onChange={(e) => setListForm({ ...listForm, category: e.target.value })}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                  >
                    <option value="Tractors">Tractor</option>
                    <option value="Harvesters">Harvester</option>
                    <option value="Sprayers">Sprayer</option>
                    <option value="Drones">Drone</option>
                    <option value="Pumps">Water Pump</option>
                    <option value="Threshers">Thresher</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Price Per Day (₹) *</label>
                  <Input
                    type="number"
                    placeholder="e.g. 1800"
                    value={listForm.pricePerDay}
                    onChange={(e) => setListForm({ ...listForm, pricePerDay: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Horsepower / Spec</label>
                  <Input
                    placeholder="e.g. 45 HP / 500L Tank"
                    value={listForm.hp}
                    onChange={(e) => setListForm({ ...listForm, hp: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Farm Location / Village</label>
                  <Input
                    placeholder="e.g. Ojhar, Nashik"
                    value={listForm.location}
                    onChange={(e) => setListForm({ ...listForm, location: e.target.value })}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full cursor-pointer h-10 mt-2 font-semibold">
                Submit & List Equipment
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tab: My Bookings */}
      {tab === "bookings" && (
        <div className="space-y-4">
          {myBookings.length === 0 ? (
            <Card className="text-center p-12">
              <Tractor className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
              <h3 className="text-lg font-bold font-display">No Active Bookings</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                You haven&apos;t reserved any machinery yet. Browse nearby equipment and book in
                seconds.
              </p>
              <Button onClick={() => setTab("browse")} className="mt-4 cursor-pointer">
                Browse Machinery
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {myBookings.map((b) => (
                <Card key={b.id} className="p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <Badge variant="success" className="mb-1">
                      {b.status}
                    </Badge>
                    <h4 className="font-bold text-base font-display">{b.machineName}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Booked on: {b.date} • Duration: {b.days} days
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Total Cost</p>
                      <p className="font-extrabold text-lg text-primary font-display">
                        ₹{b.total.toLocaleString()}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer text-destructive text-xs"
                      onClick={() => {
                        setMyBookings(myBookings.filter((x) => x.id !== b.id));
                        toast.info("Booking cancelled.");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

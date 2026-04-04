import { useState } from "react";
import { Button, Card, TopBar } from "../components/UI";

const TAGS = ["Great service", "On time", "Very clean", "Friendly", "Thorough", "Eco products", "Professional", "Careful"];

export default function ReviewPage({ navigate, bookingData }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [tags, setTags] = useState([]);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (t) => setTags(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => navigate("landing"), 2500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-surface-900 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-primary-500/15 flex items-center justify-center mx-auto mb-6">
            <div className="w-16 h-16 rounded-full bg-primary-500/25 flex items-center justify-center">
              <span className="text-3xl">🙏</span>
            </div>
          </div>
          <h2 className="font-display text-3xl text-white mb-2">Thank you!</h2>
          <p className="text-surface-400 mb-1">Your review helps us improve.</p>
          <p className="text-sm text-surface-500">Returning to home...</p>
        </div>
      </div>
    );
  }

  const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent!"];

  return (
    <div className="min-h-screen bg-surface-900 pb-28">
      <TopBar title="Rate Your Experience" onBack={() => navigate("tracking")} />

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Washer card */}
        <Card glow className="p-6 mb-6 text-center">
          <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center font-display text-primary-400 text-2xl mx-auto mb-3">JN</div>
          <h3 className="font-display text-xl text-white mb-0.5">Jean Nkurunziza</h3>
          <p className="text-surface-400 text-sm mb-1">Washed your car today</p>
          <p className="text-xs text-surface-500">{bookingData.service?.name || "Standard Wash"} · {bookingData.date || "Today"}</p>
        </Card>

        {/* Star rating */}
        <div className="text-center mb-8">
          <p className="text-surface-300 text-sm mb-4">How was your experience?</p>
          <div className="flex justify-center gap-3 mb-3">
            {[1, 2, 3, 4, 5].map(s => (
              <button key={s}
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(s)}
                className="transition-all duration-150 hover:scale-110"
                style={{fontSize:"42px", lineHeight:1}}>
                <span style={{filter: (hover || rating) >= s ? "none" : "grayscale(1) opacity(0.3)"}}>⭐</span>
              </button>
            ))}
          </div>
          {(hover || rating) > 0 && (
            <p className={`text-sm font-medium transition-all ${rating >= 5 ? "text-accent-400" : "text-primary-400"}`}>
              {ratingLabels[hover || rating]}
            </p>
          )}
        </div>

        {/* Tags */}
        {rating > 0 && (
          <div className="mb-6">
            <p className="text-sm font-medium text-surface-300 mb-3">What stood out? <span className="text-surface-500 font-normal">(select all that apply)</span></p>
            <div className="flex flex-wrap gap-2">
              {TAGS.map(t => (
                <button key={t} onClick={() => toggleTag(t)}
                  className={`text-sm px-4 py-2 rounded-full border transition-all ${tags.includes(t) ? "bg-primary-500/15 border-primary-500/50 text-primary-400" : "bg-surface-800/50 border-white/8 text-surface-300 hover:border-white/20 hover:text-white"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Comment */}
        {rating > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-surface-300 mb-2">Leave a comment <span className="text-surface-500 font-normal">(optional)</span></label>
            <textarea
              placeholder="Tell us more about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-surface-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none text-sm transition-all"
            />
          </div>
        )}

        {/* Tip */}
        {rating >= 4 && (
          <Card className="p-4 mb-6">
            <p className="text-sm font-medium text-white mb-3">Leave a tip for Jean 💛</p>
            <div className="flex gap-2">
              {[500, 1000, 2000, 0].map(amt => (
                <button key={amt} className="flex-1 py-2.5 rounded-xl border border-white/8 bg-surface-800/50 hover:border-accent-400/40 hover:bg-accent-400/8 text-sm text-surface-300 hover:text-accent-400 transition-all">
                  {amt === 0 ? "Skip" : `${amt.toLocaleString()} RWF`}
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Book again */}
        <div className="bg-surface-800/30 border border-white/6 rounded-2xl p-5 text-center">
          <p className="text-sm text-surface-400 mb-3">Want to book again?</p>
          <Button variant="outline" size="sm" onClick={() => navigate("booking")}>Book next wash →</Button>
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-surface-900/95 backdrop-blur-md border-t border-white/8 p-4 z-30">
        <div className="max-w-2xl mx-auto">
          <Button className="w-full h-12" disabled={rating === 0} onClick={handleSubmit}>
            Submit Review →
          </Button>
        </div>
      </div>
    </div>
  );
}
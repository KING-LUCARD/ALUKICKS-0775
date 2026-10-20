import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useSubscribe } from "../queries/newsletter";

export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const subscribe = useSubscribe();

  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        subscribe.mutate({ email });
      }}
    >
      <AnimatePresence mode="wait">
        {subscribe.isSuccess ? (
          <motion.p key="ok" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="label border-b border-infra py-4 text-infra">
            You're on the list. Watch your inbox.
          </motion.p>
        ) : (
          <motion.div key="form" exit={{ opacity: 0, y: -10 }} className="flex items-center border-b border-bone/25 focus-within:border-infra transition-colors">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="flex-1 bg-transparent py-4 text-[15px] outline-none placeholder:text-ash"
              aria-label="Email address"
            />
            <button type="submit" disabled={subscribe.isPending} className="label flex items-center gap-2 py-4 pl-4 hover:text-infra disabled:opacity-50">
              {subscribe.isPending ? <Loader2 size={14} className="animate-spin" /> : <>Join <ArrowRight size={14} /></>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {subscribe.isError && <p className="label mt-3 text-infra">Something went wrong. Try again.</p>}
    </form>
  );
}

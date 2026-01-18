import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />
      
      {/* Animated orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/30 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.15, 1],
          x: [0, -20, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 text-sm mb-8"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Join 50,000+ students already connected</span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
            Ready to own your{" "}
            <span className="text-gradient-primary">campus experience?</span>
          </h2>

          <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto">
            Stop missing out on the conversations, challenges, and connections 
            happening at your school. Join CampusConnect today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl">
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="glass" size="xl">
              Watch Demo
            </Button>
          </div>

          <p className="text-sm text-white/40 mt-8">
            Free forever. No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;

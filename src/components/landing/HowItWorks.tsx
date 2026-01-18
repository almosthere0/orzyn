import { motion } from "framer-motion";
import { Search, School, MessageCircle, Trophy } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Find Your School",
    description: "Search from thousands of schools & universities worldwide. Can't find yours? Add it!",
  },
  {
    number: "02",
    icon: School,
    title: "Join Your Class",
    description: "Select your grade and class to unlock your private group chats and community.",
  },
  {
    number: "03",
    icon: MessageCircle,
    title: "Connect & Share",
    description: "Start chatting, posting memes, rating teachers, and making new friends instantly.",
  },
  {
    number: "04",
    icon: Trophy,
    title: "Rise to the Top",
    description: "Earn reputation points, join challenges, and become the legend of your campus.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
            Get started in{" "}
            <span className="text-gradient-accent">4 easy steps</span>
          </h2>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary -translate-y-1/2" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="relative"
              >
                <div className="bg-card border border-border rounded-2xl p-6 shadow-card text-center relative z-10">
                  {/* Step number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground shadow-glow">
                    {index + 1}
                  </div>
                  
                  <div className="mt-4 mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  
                  <h3 className="font-display font-semibold text-lg text-card-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

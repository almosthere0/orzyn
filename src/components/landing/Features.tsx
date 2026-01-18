import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Trophy, 
  Star, 
  Users, 
  Zap, 
  BookOpen,
  Crown,
  Target
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Class Group Chats",
    description: "Real-time messaging with your classmates. Every class, every grade, automatically organized.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Trophy,
    title: "Epic Challenges",
    description: "School vs School battles, study marathons, and friendly competitions with real rewards.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Star,
    title: "Rate Everything",
    description: "Anonymous ratings for teachers, classes, and schools. Help others make better choices.",
    color: "bg-yellow-500/10 text-yellow-500",
  },
  {
    icon: Crown,
    title: "Class Elections",
    description: "Rise to the top! Earn points and become the elected leader of your class chat.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Users,
    title: "Find Your Tribe",
    description: "Connect with students who share your interests. Gaming, K-pop, coding, or study buddies.",
    color: "bg-pink-500/10 text-pink-500",
  },
  {
    icon: BookOpen,
    title: "Exam Communities",
    description: "SAT, AP, Qudurat—join focused communities for every major exam and ace them together.",
    color: "bg-green-500/10 text-green-500",
  },
  {
    icon: Zap,
    title: "Reputation System",
    description: "Build your rep through helpful contributions. Unlock perks and exclusive features.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Target,
    title: "Study Goals",
    description: "Set targets, track progress, and compete on leaderboards for academic excellence.",
    color: "bg-blue-500/10 text-blue-500",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
            Everything you need for{" "}
            <span className="text-gradient-primary">campus life</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From class chats to epic competitions—we've got your entire student experience covered.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="h-full bg-card border border-border rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all duration-300">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-semibold text-lg text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

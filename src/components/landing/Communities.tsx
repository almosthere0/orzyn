import { motion } from "framer-motion";
import { Users, TrendingUp, MessageSquare } from "lucide-react";

const communities = [
  {
    name: "SAT Prep",
    members: "12.5K",
    posts: "2.3K",
    icon: "📚",
    trending: true,
  },
  {
    name: "AP Calculus",
    members: "8.2K",
    posts: "1.1K",
    icon: "📐",
    trending: false,
  },
  {
    name: "Study Memes",
    members: "45K",
    posts: "15K",
    icon: "😂",
    trending: true,
  },
  {
    name: "College Apps 2026",
    members: "23K",
    posts: "5.6K",
    icon: "🎓",
    trending: true,
  },
  {
    name: "CS Majors",
    members: "18K",
    posts: "4.2K",
    icon: "💻",
    trending: false,
  },
  {
    name: "Mental Health",
    members: "31K",
    posts: "2.8K",
    icon: "🧠",
    trending: false,
  },
];

const Communities = () => {
  return (
    <section className="py-24 bg-background relative">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Communities
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
            Join communities you{" "}
            <span className="text-gradient-primary">actually care about</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From exam prep to memes, find your people and grow together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {communities.map((community, index) => (
            <motion.div
              key={community.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              className="group cursor-pointer"
            >
              <div className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 shadow-card hover:shadow-elevated hover:border-primary/30 transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                  {community.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-card-foreground truncate">
                      {community.name}
                    </h3>
                    {community.trending && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium">
                        <TrendingUp className="w-3 h-3" />
                        Hot
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {community.members}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {community.posts}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-10"
        >
          <span className="text-muted-foreground">
            And <span className="text-primary font-semibold">500+</span> more communities to explore...
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default Communities;

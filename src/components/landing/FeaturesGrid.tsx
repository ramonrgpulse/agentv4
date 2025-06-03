import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

// Interface para um único item de feature
interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: "red" | "orange" | "yellow" | "default";
}

interface FeaturesGridProps {
  title: string;
  subtitle: string;
  features: FeatureItem[];
  columns?: 2 | 3 | 4;
}

export const FeaturesGrid = ({ 
  title, 
  subtitle, 
  features, 
  columns = 3
}: FeaturesGridProps) => {
  // Determinar as classes de grid com base no número de colunas
  const getGridClasses = () => {
    switch (columns) {
      case 2: return "grid-cols-1 sm:grid-cols-2";
      case 3: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
      case 4: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
      default: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    }
  };

  // Obter classe de cor para o ícone baseado na propriedade color
  const getIconColorClass = (color?: string) => {
    switch (color) {
      case "red": return "text-brutal-red";
      case "orange": return "text-brutal-orange";
      case "yellow": return "text-brutal-yellow";
      default: return "text-brutal-red";
    }
  };

  // Variantes de animação para o container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Variantes de animação para os itens
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="py-16 md:py-24 bg-brutal-oldpaper">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4 text-brutal-darker font-oswald"
          >
            {title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-brutal-darker/80 max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className={`grid ${getGridClasses()} gap-8`}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 group hover:-translate-y-1 hover:border-brutal-red/20"
              >
                <div className="mb-4 p-3 rounded-full bg-brutal-red/10 inline-block">
                  <Icon className={`h-6 w-6 ${getIconColorClass(feature.color)}`} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-brutal-darker font-oswald group-hover:text-brutal-red transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-brutal-darker/70">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

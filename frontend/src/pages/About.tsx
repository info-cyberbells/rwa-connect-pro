import { motion } from "framer-motion";
import { Target, Eye, Heart,CreditCard, Lock,Users, CheckCircle,Award, Shield } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";


const values = [
  {
    icon: Heart,
    title: "Customer First",
    description: "We put the needs of society committees and members at the heart of everything we build.",
  },
  {
    icon: Shield,
    title: "Trust & Security",
    description: "Your data security and privacy are our top priorities. We maintain the highest standards.",
  },
  {
    icon: Users,
    title: "Community Focus",
    description: "We believe in strengthening communities through better communication and transparency.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We strive for excellence in every feature, ensuring the best experience for our users.",
  },
];

const team = [
  {
    name: "Vikram Mehta",
    role: "CEO & Founder",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Priya Sharma",
    role: "CTO",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Rahul Gupta",
    role: "Head of Product",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Anjali Patel",
    role: "Head of Customer Success",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
  },
];
  const features = [
    {
      title: "Trust & Responsibility",
      desc: "Focused on secure, transparent, and reliable society management.",
      icon: <Shield className="w-8 h-8 text-blue-600" />,
    },
    {
      title: "Data Privacy & Security",
      desc: "Member and society data is kept secure with controlled access.",
      icon: <Lock className="w-8 h-8 text-green-600" />,
    },
    {
      title: "Transparent Payment Records",
      desc: "Payments are recorded clearly for easy tracking and verification.",
      icon: <CreditCard className="w-8 h-8 text-yellow-600" />,
    },
    {
      title: "Role-Based Access",
      desc: "Access is given based on roles for committees and members.",
      icon: <Users className="w-8 h-8 text-purple-600" />,
    },
    {
      title: "Reliable System",
      desc: "Built to support smooth and organized daily society operations.",
      icon: <CheckCircle className="w-8 h-8 text-red-600" />,
    },
  ];
export default function About() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-12">
        <div className="absolute inset-0 hero-gradient opacity-5" />
        <div className="container mx-auto container-padding relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-heading font-bold mb-6"
            >
              Building Better <span className="text-gradient">Communities</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground"
            >
              SocietySmartHub was founded with a simple mission: to make society management
              effortless, transparent, and accessible for every housing community in India.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="pt-16 pb-12 bg-muted/50">
        <div className="container mx-auto container-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2020, SocietySmartHub emerged from a real need experienced by our founders
                  who served on their own housing society committees. The challenges of managing member
                  records, tracking payments, and communicating effectively with residents inspired us
                  to create a better solution.
                </p>
                <p>
                  Today, we serve over 500 housing societies across India, helping them streamline
                  operations, improve transparency, and build stronger communities. Our platform handles
                  millions of rupees in payment tracking and serves over 50,000 residents.
                </p>
                <p>
                  We continue to innovate and expand our features based on direct feedback from society
                  administrators and members, ensuring that SocietySmartHub remains the most comprehensive
                  and user-friendly society management platform in the market.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 hero-gradient rounded-3xl opacity-20 blur-2xl" />
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop"
                alt="Modern apartment buildings"
                className="relative rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="pt-16 pb-12">
        <div className="container mx-auto container-padding">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-card rounded-2xl card-shadow"
            >
              <div className="w-14 h-14 rounded-xl hero-gradient flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4">Our Mission</h3>
              <p className="text-muted-foreground">
                To empower housing societies with technology that simplifies administration,
                enhances transparency, and strengthens community bonds. We believe every society
                deserves access to professional-grade management tools.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-card rounded-2xl card-shadow"
            >
              <div className="w-14 h-14 rounded-xl hero-gradient flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4">Our Vision</h3>
              <p className="text-muted-foreground">
                To become the most trusted society management platform in India, serving
                millions of residents and setting the standard for how communities operate
                in the digital age.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="pt-16 pb-12 bg-muted/50">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at SocietySmartHub.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-card rounded-2xl card-shadow text-center"
              >
                <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-heading font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="pt-16 pb-12">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The passionate people behind SocietySmartHub working to transform society management.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative mb-4 inline-block">
                  <div className="absolute inset-0 hero-gradient rounded-full opacity-20 blur-xl" />
                  <img
                    src={member.image}
                    alt={member.name}
                    className="relative w-32 h-32 rounded-full object-cover mx-auto ring-4 ring-card"
                  />
                </div>
                <h3 className="font-heading font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Trust & Responsibility section */}
  <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6 text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800">Our Core Values</h2>
        <p className="text-gray-600 mt-4">
          We focus on building trust, security, and efficiency for every society member.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
          {/* Trust & Responsibility section end */}

    </PublicLayout>
  );
}

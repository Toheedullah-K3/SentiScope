const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <div className={`bg-gradient-to-br ${color} rounded-xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 border border-white/10`}>
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
    </div>
    <p className="text-white/90 leading-relaxed">{description}</p>
  </div>
);

export default FeatureCard;
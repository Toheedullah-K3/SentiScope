import { Brain, BarChart3, TrendingUp, Clock, Target, Star } from 'lucide-react';

export const faqs = [
    {
      question: "How does sentiment analysis work in this app?",
      answer: "Our advanced sentiment analysis engine combines multiple NLP models including VADER, TextBlob, and cutting-edge GenAI to provide comprehensive sentiment scoring. We analyze posts from Reddit, GNews, and other platforms using natural language processing to understand emotional context, sarcasm, and nuanced expressions.",
      icon: Brain
    },
    {
      question: "What do the Total Posts and Sentiment Score mean?",
      answer: "Total Posts represents the number of analyzed content pieces from your query. The Sentiment Score is a weighted average ranging from -1 (very negative) to +1 (very positive), with 0 being neutral. Our algorithm considers factors like post engagement, recency, and source credibility.",
      icon: BarChart3
    },
    {
      question: "How can I compare two different topics?",
      answer: "Navigate to the 'Compare Trends' section where you can enter multiple keywords, select different analysis models, choose various platforms, and set time ranges. The side-by-side comparison includes visual charts, sentiment timelines, and detailed breakdowns.",
      icon: TrendingUp
    },
    {
      question: "Why is my analysis taking too long?",
      answer: "Processing time depends on query complexity, data volume, and external API response times. For faster results, try narrowing your search terms, reducing the time range, or using specific platforms. Premium users get priority processing.",
      icon: Clock
    },
    {
      question: "Can I export my analysis results?",
      answer: "Yes! You can export your sentiment analysis data in multiple formats including CSV, JSON, and PDF reports. The export includes raw data, visualizations, and detailed insights for further analysis or presentations.",
      icon: Target
    },
    {
      question: "How accurate is the sentiment analysis?",
      answer: "Our multi-model approach achieves 85-92% accuracy across different content types. We continuously train our models on diverse datasets and provide confidence scores for each analysis. Results may vary based on context, sarcasm, and cultural nuances.",
      icon: Star
    }
  ];
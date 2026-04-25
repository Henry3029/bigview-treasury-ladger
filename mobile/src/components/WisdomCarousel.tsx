import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Animated } from 'react-native';
import { Quote, Sparkles, TrendingUp, Trophy, Target, Lightbulb } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

const quotes = [
  { text: "Discipline is the bridge between goals and accomplishments.", sage: "Jim Rohn", color: ['#064e3b', '#065f46', '#000000'], icon: <Target color="#34d399" size={20} /> },
  { text: "The only way to predict your future is to create it.", sage: "Abraham Lincoln", color: ['#1e3a8a', '#1e1b4b', '#000000'], icon: <Sparkles color="#93c5fd" size={20} /> },
  { text: "The only true wisdom is in knowing you know nothing.", sage: "Socrates", color: ['#0f172a', '#1e293b', '#000000'], icon: <Lightbulb color="#facc15" size={20} /> },
  { text: "Your time is limited, don't waste it living someone else's life.", sage: "Steve Jobs", color: ['#7f1d1d', '#431407', '#000000'], icon: <Trophy color="#fb923c" size={20} /> },
  { text: "Life is what happens when you're busy making other plans.", sage: "John Lennon", color: ['#581c87', '#312e81', '#000000'], icon: <TrendingUp color="#c084fc" size={20} /> },
  { text: "The journey of a thousand miles begins with one step.", sage: "Lao Tzu", color: ['#134e4a', '#064e3b', '#000000'], icon: <Quote color="#2dd4bf" size={20} /> },
];

export default function WisdomCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % quotes.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setActiveIndex(nextIndex);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={quotes}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <LinearGradient colors={item.color} style={styles.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}>{item.icon}</View>
                <Text style={styles.badgeText}>Bigview Insight</Text>
              </View>
              <Text style={styles.quoteText}>"{item.text}"</Text>
              <Text style={styles.sageText}>— {item.sage}</Text>
              <Text style={styles.bgText}>WISE</Text>
            </LinearGradient>
          </View>
        )}
      />
      <View style={styles.pagination}>
        {quotes.map((_, i) => (
          <View key={i} style={[styles.dot, activeIndex === i ? styles.activeDot : styles.inactiveDot]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center' },
  cardContainer: { width: width, paddingHorizontal: 20 },
  card: { borderRadius: 24, padding: 20, minHeight: 140, justifyContent: 'center', overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  iconBox: { padding: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 },
  badgeText: { fontSize: 9, fontWeight: '900', color: '#FFD700', letterSpacing: 0.5 },
  quoteText: { color: '#FFF', fontSize: 14, fontWeight: 'bold', lineHeight: 20 },
  sageText: { color: 'rgba(255,255,255,0.5)', fontSize: 9, marginTop: 8 },
  bgText: { position: 'absolute', right: -10, bottom: -10, fontSize: 60, fontWeight: '900', color: 'rgba(255,255,255,0.03)' },
  pagination: { flexDirection: 'row', gap: 6, marginTop: 12 },
  dot: { height: 4, borderRadius: 2 },
  activeDot: { width: 24, backgroundColor: 'rgba(255,255,255,0.4)' },
  inactiveDot: { width: 6, backgroundColor: 'rgba(255,255,255,0.1)' },
});
// LibraryScreen.js - Fixed version with add button, name greeting, and empty state handling
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Audio } from 'expo-av';

export default function LibraryScreen({ navigation }) {
  const [stories, setStories] = useState([]);
  const [playing, setPlaying] = useState(null);
  const [sound, setSound] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [userName, setUserName] = useState('Heidi'); // Placeholder name for now

  useEffect(() => {
    const fetchStories = async () => {
      const db = getFirestore();
      const snapshot = await getDocs(collection(db, 'stories'));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setStories(data);
    };

    fetchStories();
  }, []);

  const playSound = async (url, id) => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
      setPlaying(null);
    }

    const { sound: newSound } = await Audio.Sound.createAsync({ uri: url });
    setSound(newSound);
    setPlaying(id);
    await newSound.playAsync();
  };

  const updateTitle = async (id) => {
    const db = getFirestore();
    await updateDoc(doc(db, 'stories', id), { title: newTitle });
    setEditingId(null);
    setNewTitle('');
    const snapshot = await getDocs(collection(db, 'stories'));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setStories(data);
  };

  const toggleFavorite = async (id, currentStatus) => {
    const db = getFirestore();
    await updateDoc(doc(db, 'stories', id), { favorite: !currentStatus });
    const snapshot = await getDocs(collection(db, 'stories'));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setStories(data);
  };

  const storyData = [...stories, { id: 'add' }];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Story Library</Text>
      <Text style={styles.subtitle}>Hi, my name is {userName}</Text>

      {stories.length === 0 && (
        <Text style={styles.empty}>You haven’t recorded any bedtime stories yet.</Text>
      )}

      <FlatList
        data={storyData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          if (item.id === 'add') {
            return (
              <TouchableOpacity style={styles.addCard} onPress={() => navigation.navigate('Recorder')}>
                <Text style={styles.addText}>＋ Add Story</Text>
              </TouchableOpacity>
            );
          }

          return (
            <View style={styles.card}>
              <TouchableOpacity onPress={() => playSound(item.audioUrl, item.id)}>
                <Image
                  source={item.coverUrl ? { uri: item.coverUrl } : require('../assets/StoryNook-icon.png')}
                  style={styles.cover}
                />
              </TouchableOpacity>

              {editingId === item.id ? (
                <TextInput
                  style={styles.input}
                  value={newTitle}
                  onChangeText={setNewTitle}
                  placeholder="Enter new title"
                />
              ) : (
                <Text style={styles.cardTitle}>{item.title || 'Untitled Story'}</Text>
              )}

              <Text style={styles.playingText}>{playing === item.id ? '🔊 Playing' : '▶️ Tap cover to play'}</Text>

              {editingId === item.id ? (
                <TouchableOpacity onPress={() => updateTitle(item.id)}>
                  <Text style={styles.editBtn}>💾 Save</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => {
                  setEditingId(item.id);
                  setNewTitle(item.title);
                }}>
                  <Text style={styles.editBtn}>✏️ Rename</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={() => toggleFavorite(item.id, item.favorite)}>
                <Text style={styles.favorite}>{item.favorite ? '⭐️ Favorited' : '☆ Favorite'}</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9F7FB',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#6A5ACD',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#444',
    marginBottom: 16,
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    marginBottom: 24,
  },
  card: {
    padding: 16,
    backgroundColor: '#EEE',
    borderRadius: 10,
    marginBottom: 12,
  },
  cover: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  playingText: {
    fontSize: 14,
    color: '#777',
  },
  editBtn: {
    marginTop: 6,
    fontSize: 16,
    color: '#6A5ACD',
    fontWeight: 'bold',
  },
  favorite: {
    fontSize: 16,
    color: '#BAA5F8',
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    padding: 8,
    fontSize: 16,
    marginBottom: 8,
    backgroundColor: 'white',
  },
  addCard: {
    padding: 20,
    backgroundColor: '#E0D6FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  addText: {
    fontSize: 20,
    color: '#6A5ACD',
    fontWeight: '600',
  },
});

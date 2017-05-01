package org.openmrs.module.bannerprototype.wordcloud;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class WordCloud {
	
	Map<String, Word> words = new HashMap<String, Word>();
	
	/**
	 * add a word to the cloud, if exists, increment counter, else, initialize new Word object
	 * 
	 * @param word
	 * @param className
	 */
	public void addWord(String word, String className) {
		if (words.containsKey(word))
			words.get(word).incrementCount();
		else
			words.put(word, new Word(word, className));
		
	}
	
	/**
	 * get top n words, in shuffled order
	 * 
	 * @param n
	 * @return
	 */
	public List<Word> getTopWordsShuffled(int n) {
		List<Word> topList = getTopWords(n);
		
		Collections.shuffle(topList);
		return topList;
	}
	
	/**
	 * get top n words, in order of descending frequency
	 * 
	 * @param top
	 * @return
	 */
	public List<Word> getTopWords(int top) {
		List<Word> wordlist = new ArrayList<Word>();
		wordlist.addAll(words.values());
		Collections.sort(wordlist);
		Collections.reverse(wordlist);
		
		List<Word> topList;
		if (wordlist.size() < top)
			topList = wordlist;
		else
			topList = wordlist.subList(0, top);
		
		return topList;
	}
	
	/**
	 * get all words
	 * 
	 * @return
	 */
	public List<Word> getAllWords() {
		List<Word> wordlist = new ArrayList<Word>();
		wordlist.addAll(words.values());
		Collections.sort(wordlist);
		Collections.reverse(wordlist);
		
		return wordlist;
	}
}

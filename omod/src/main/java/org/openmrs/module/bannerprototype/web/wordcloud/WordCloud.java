package org.openmrs.module.bannerprototype.web.wordcloud;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class WordCloud {

	Map<String,Word> words = new HashMap<String,Word>();
	
	
	public void addWord(String word, String className){
		if(words.containsKey(word))
			words.get(word).incrementCount();
		else
			words.put(word, new Word(word, className));
		
	}
	
	public List<Word> getTopWordsShuffled(int top)
	{
		List<Word> topList = getTopWords(top);
		
		Collections.shuffle(topList);
		return topList;
	}
	
	public List<Word> getTopWords(int top)
	{
		List<Word> wordlist = new ArrayList<Word>();
		wordlist.addAll(words.values());
		Collections.sort(wordlist);
		Collections.reverse(wordlist);
		
		List<Word> topList;
		if(wordlist.size() < top)	
			topList = wordlist;
		else
			topList = wordlist.subList(0, top);
		
		return topList;
	}
}

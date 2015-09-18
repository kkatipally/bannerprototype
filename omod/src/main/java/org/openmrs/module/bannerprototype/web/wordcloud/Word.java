package org.openmrs.module.bannerprototype.web.wordcloud;

/**
 * this class represents entities/frequencies for the Word Cloud
 * 
 * @author ryaneshleman
 */
public class Word implements Comparable<Word> {
	
	private String word;
	
	private int count;
	
	private String className;
	
	public Word(String word, String className) {
		this.word = word;
		this.count = 1;
		this.className = className;
		
	}
	
	public String getWord() {
		return word;
	}
	
	public void setWord(String word) {
		this.word = word;
	}
	
	public int getCount() {
		return count;
	}
	
	public void setCount(int count) {
		this.count = count;
	}
	
	public void incrementCount() {
		this.count++;
	}
	
	/**
	 * compareTo implemented to compare word counts, for sorting by frequency
	 */
	@Override
	public int compareTo(Word w) {
		if (w.getCount() < this.count)
			return 1;
		if (w.getCount() > this.count)
			return -1;
		
		return 0;
	}
	
	public String getClassName() {
		return className;
	}
	
	public void setClassName(String className) {
		this.className = className;
	}
	
}

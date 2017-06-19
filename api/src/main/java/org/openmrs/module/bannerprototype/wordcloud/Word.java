package org.openmrs.module.bannerprototype.wordcloud;

import java.io.Serializable;

import org.openmrs.BaseOpenmrsData;

/**
 * this class represents entities/frequencies for the Word Cloud
 * 
 * @author ryaneshleman
 */
public class Word extends BaseOpenmrsData implements Serializable, Comparable {
	
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
	
	@Override
	public int compareTo(Object o) {
		Word w = (Word) o;
		if (w.getCount() < this.count)
			return 1;
		if (w.getCount() > this.count)
			return -1;
		
		return 0;
	}
	
	/**
	 * compareTo implemented to compare word counts, for sorting by frequency
	 */
	
	/*public int compareTo(Word w) {
		if (w.getCount() < this.count)
			return 1;
		if (w.getCount() > this.count)
			return -1;
		
		return 0;
	}*/
	public String getClassName() {
		return className;
	}
	
	public void setClassName(String className) {
		this.className = className;
	}
	
	@Override
	public Integer getId() {
		// TODO Auto-generated method stub
		return null;
	}
	
	@Override
	public void setId(Integer arg0) {
		// TODO Auto-generated method stub
		
	}
	
	/**
	 * Added to handle ERROR - BaseRestController.handleException(106) Could not write JSON:
	 * Conflicting getter definitions for property "voided"
	 */
	@Override
	public Boolean isVoided() {
		return super.isVoided();
	}
	
}

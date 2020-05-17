# Chinesy

This is intended as a quick way of testing not only how many characters you know, but also which exact characters. It's built for my own use-case, but feel free to play with it.

[More info about my Chinese learning](https://notes.reganmian.net/a--chinese)

## Data sources
- Hanzi frequency from [Jun Da's list](https://lingua.mtsu.edu/chinese-computing/statistics/char/list.php?Which=MO)
- Bigrams from [BLCU Chinese Corpus - global word frequency](https://www.plecoforums.com/threads/word-frequency-list-based-on-a-15-billion-character-corpus-bcc-blcu-chinese-corpus.5859/)

## Usage
The idea is that you would like to establish for example how many of the first 1000 characters that you actually know, and how well you know them.

- Open the page, and choose from 0 to 1000, showing 50 characters each time.
- For each character, click to toggle between three levels of knowledge, or not knowing. 
  - For me, this corresponds to being completely sure about pronunciation and meaning, being able to read it in context, knowing something about it (guessing meaning without prounciation for example), or not knowing, but you can define it however you see fit
- To toggle all characters on screen into a certain state, click shift+1/2/3 or shift+0 to reset
- All selections are stored in localStorage, and will be there the next time you open the browser. No data is sent to any server.
- You can see how many characters you have already processed, if you hover over that line, you'll see how many in each category, and click on it to toggle between seeing all characters processed, and seeing new characters.
- If you hold shift and hover over a character, you see the pinyin and translation (I use this to check whether I'm correct, if I am in doubt). If you hold Cmd (on Mac) and hover, you see four bigrams with this character in them (I use this to see if I can recognize the character in context)
- You can click "Download" to get a CSV file with all the characters you've processed, the global frequency, the translation, etc.

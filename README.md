# 🐶Emoogle Emoji Picker

Emoogle Emoji Picker is an open-source emoji picker React component that allows people to easily find the emojis they want and uses emojis joyfully.

It is created by and powers [Emoogle](https://www.emoogle.org/), the best emoji desktop app for emoji fans.

<img src="https://i.ibb.co/cbbsynq/emoogle-emoji-picker.gif" alt="Emoogle Emoji Picker" width="298"/>

Demo link: [emoogle.org/emoji-search](https://www.emoogle.org/emoji-search)

## ✨Features

- 🔍Run the [Emoogle Emoji Search Engine](https://github.com/xitanggg/emoogle-emoji-search-engine) that comes with
  - 🗃️World's largest emoji keywords database with 5,400+ unique keywords for 1,872 emojis
  - 🏆Advanced ranking algorithm with 10+ rules to sort most relevant results first
  - ⚡Blazingly fast search-as-you-type experience (~10ms on Intel i7 @ 2.6GHz, ~5ms on Apple M2)
  - ⚙️Customizable options to personalize search experience
    - Including custom keywords, user preferred most relevant emoji and user recently searched inputs
- 🧭Navigate by nav bar group icons
- 🤖Search with intelligent autocomplete
- ⌨️Select emoji using keyboard navigation
- 🤚Skin tone
- 🌓Light/dark mode
- 👀Preview emoji's name and symbolic words
- 💻Platform independent (Web or Desktop, Windows or Mac)
- 🔖[Emoji v15.1](https://unicode.org/Public/emoji/15.1/emoji-test.txt)

⚠️Limitation: only works for English words

## 📦Installation

```bash
npm install emoogle-emoji-picker emoogle-emoji-search-engine zustand
```

## 📖Usage

Simple usage

```typescript
import 'emoogle-emoji-picker/dist/index.css';
import { EmojiPicker } from 'emoogle-emoji-picker';

<EmojiPicker />
```

Customized usage (See `/playground/index.tsx` for full example)

```typescript
import 'emoogle-emoji-picker/dist/index.css';
import { useState, useEffect } from 'react';
import { EmojiPicker, type EmojiPickerProps } from 'emoogle-emoji-picker';

const CustomizedEmojiPicker = () => {
  const [store, setStore] = useState<EmojiPickerProps>({});

  // Hook to load data and set store
  // Normally, it should be loading from a database source.
  // For demo purpose, it is loading from hardcoded data.
  useEffect(() => {
    // Use default skin tone
    const skinTone = undefined;
    // Use system preference for dark mode
    const darkMode = undefined;
    // Frequently used emojis are shown on top of scroll pane when search input is empty
    const frequentlyUsedEmojis = ['👋', '🤩', '🫶', '🙏'];
    // Custom emoji keywords to augment keywords database
    // e.g. searching 'amazing' shows '🏆' emoji
    const customEmojiKeywords = {
      '🏆': ['amazing'],
    };
    // Recently searched inputs are ranked higher for prefix match & autocomplete
    // e.g. searching 'h' ranks 'hello' first
    const recentlySearchedInputs = ['hello', 'amazing'];
    setStore({
      skinTone,
      darkMode,
      frequentlyUsedEmojis,
      customEmojiKeywords,
      recentlySearchedInputs,
    });
  }, []);

  return (
    <EmojiPicker
      autoFocus={true}
      skinTone={store.skinTone}
      darkMode={store.darkMode}
      onEmojiClick={(emojiVariant, resetEmojiPickerState) => {
        // Copy emoji to clipboard
        navigator.clipboard.writeText(emojiVariant);
        // Reset emoji picker state
        resetEmojiPickerState();
      }}
      frequentlyUsedEmojis={store.frequentlyUsedEmojis}
      customEmojiKeywords={store.customEmojiKeywords}
      customKeywordMostRelevantEmoji={store.customKeywordMostRelevantEmoji}
      recentlySearchedInputs={store.recentlySearchedInputs}
    />
  );
};
```

## 🏷️Props

Note: All props are optional

| **Prop**                                                                            | <div style="width:160px">**Type**</div>                                                                                                | **Default** | **Description**                                                                                                                                                                                           |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| autoFocus                                                                           | `boolean`                                                                                                                              | `false`     | Set `true` to auto focus search input on component mounts                                                                                                                                                 |
| onEmojiClick                                                                        | (emojiWithVariant: `string`, resetEmojiPickerState: `() => void`, baseEmoji: `string`, group: `Group`, searchInput: `string`) => void; | `undefined` | Callback that is triggered when an emoji is clicked or is selected by pressing the `Enter` key                                                                                                            |
| onBlur                                                                              | (resetEmojiPickerState: `() => void`) => void;                                                                                         | `undefined` | Callback that is triggered when the emoji picker loses focus, e.g. user clicks outside                                                                                                                    |
| onEscapeKeyDown                                                                     | () => void;                                                                                                                            | `undefined` | Callback that is triggered when the `Escape` key is pressed                                                                                                                                               |
| skinTone                                                                            | SkinTone (enum)                                                                                                                        | `undefined` | Set skin tone preference. Can be 1 of the 6 values: `undefined`, `SkinTone.Light`, `SkinTone.MediumLight`, `SkinTone.Medium`, `SkinTone.MediumDark`, `SkinTone.Dark`. `undefined` uses default skin tone. |
| darkMode                                                                            | boolean                                                                                                                                | `undefined` | Set dark mode preference. `undefined` follows system preference. `true` uses dark mode. `false` uses light mode.                                                                                          |
| frequentlyUsedEmojis                                                                | string[]                                                                                                                               | `[]`        | Set frequently used emojis that are shown on top of scroll pane when search input is empty                                                                                                                |
| customEmojiKeywords                                                                 | Record<string, string[]>                                                                                                               | `{}`        | Set custom emoji keywords to augment keywords database                                                                                                                                                    |
| <div style="width:150px;word-wrap:break-word;">customKeywordMostRelevantEmoji</div> | Record<string, string>                                                                                                                 | `{}`        | Set user preferred keyword to emoji match                                                                                                                                                                 |
| recentlySearchedInputs                                                              | string[]                                                                                                                               | `[]`        | Set recently searched inputs to get ranked higher for prefix match and autocomplete                                                                                                                       |
| emojiToSpecialVariant                                                               | Record<string, string>                                                                                                                 | `{}`        | Set user preferred emoji special variant for the 17 special emojis                                                                                                                                        |

## 📁Project Structure

| <div style="width:150px">**Code Path**</div> | **Description**                                                                                                                                                                                                                                                                                                                   |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| /src/components/EmojiPicker.tsx              | Code entry point to `EmojiPicker` component, which is composed of 4 main components: `GroupsNavBar`, `SearchBar`, `ScrollPane`, `Preview`                                                                                                                                                                                         |
| /src/lib/store                               | Folder for store and state management utils                                                                                                                                                                                                                                                                                       |
| /data                                        | Folder for various data files <ul><li>`group-to-base-emojis.json` - mapping of 9 emoji groups to their base emojis</li><li>`emoji-to-skin-tone-variants.json` - mapping of 323 base emojis to their 5 skin tone variants</li><li>`emoji-to-special-variants.json` - mapping of 17 base emojis to their special variants</li></ul> |
| /scripts/create-data.ts                      | Script used to create the 3 data json files listed above from the Unicode emoji data file                                                                                                                                                                                                                                         |

## 📚 Tech Stack & Dependencies

- [Emoogle Emoji Search Engine](https://github.com/xitanggg/emoogle-emoji-search-engine) for emoji keyword database and ranking algorithm
- [Typescript](https://github.com/microsoft/TypeScript) for language
- [React](https://github.com/facebook/react) for UI library
- [Google Fonts Noto Emoji](https://github.com/googlefonts/noto-emoji) for group icons shown in nav bar
- [Zustand](https://github.com/pmndrs/zustand) for store and state management
- [TailwindCSS](https://github.com/tailwindlabs/tailwindcss) for CSS styling and [tailwind-scrollbar](https://github.com/adoxography/tailwind-scrollbar) for scroll bar styling
- [tsup](https://github.com/egoist/tsup) for bundling the component into dist
- [Vite](https://github.com/vitejs/vite) for local development
- [Matt Pocock](https://www.totaltypescript.com/how-to-create-an-npm-package) for guide to create a npm package and set up `package.json` like a pro

## 💻Local Development

You can test the Emoogle Emoji Picker component locally and make changes if you would like

1. Download the repo `git clone https://github.com/xitanggg/emoogle-emoji-picker.git`
2. Change the directory `cd emoogle-emoji-picker`
3. Install the dependency `npm install`
4. Start a development server `npm run dev`
5. Open your browser and visit http://localhost:3000 to see Emoogle Emoji Picker live

## 🫶Contribution

**Emoji keywords database**

While the emoji keywords database contains 5,400+ unique keywords, the average person speaks much more words, ranging from 7k to 20k words according to [wordmetrics.org](https://worldmetrics.org/average-words-spoken-per-day/).

If you notice a keyword missing for an emoji, feel free to help improve it and add it to the database.

If you prefer to contribute with a simple no code solution, you can simply add the keyword to the [database spreadsheet](https://emoogle.org/database), which will sync with this repo on a recurring basis.

If you prefer to update in code, please head over to the [emoogle-emoji-search-engine](https://github.com/xitanggg/emoogle-emoji-search-engine) repo for further instruction.

## ⚖️License

MIT License

## 🐶Sponsor

<img src="https://i.ibb.co/9ZPNhzS/emoogle.gif" alt="Emoogle" width="275"/>

Emoogle Emoji Picker is created as the core emoji picker to power [Emoogle](https://www.emoogle.org/), the best emoji desktop app for emoji fans.

At Emoogle, we believe that emoji enables us to be more expressive and add fun, color, and personality to the internet. If you’re as excited about emoji as we are, give [Emoogle](https://www.emoogle.org/) a try and let’s make the internet more fun and expressive together🙌

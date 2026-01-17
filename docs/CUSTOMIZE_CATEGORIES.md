# Customizing Categories

This guide explains how to customize the categories used in Athan Notes for organizing your voice notes.

## Table of Contents

- [Quick Start](#quick-start)
- [Understanding Categories](#understanding-categories)
- [Step-by-Step Guide](#step-by-step-guide)
- [Category Configuration Format](#category-configuration-format)
- [Category Descriptions](#category-descriptions)
- [Adding New Categories](#adding-new-categories)
- [Editing Existing Categories](#editing-existing-categories)
- [Removing Categories](#removing-categories)
- [Troubleshooting](#troubleshooting)
- [Example Category Sets](#example-category-sets)

---

## Quick Start

**3 steps to customize your categories:**

1. **Copy the example config file:**
   ```bash
   cp config/categories.example.json config/categories.json
   ```

2. **Edit `config/categories.json`** with your preferred categories

3. **Update your Notion database** to match the category names exactly

4. **Restart the app** (development or production server)

That's it! Your app will now use your custom categories.

---

## Understanding Categories

### What are Categories?

Categories help organize your voice notes into broad topics. When you record a voice note, Gemini AI automatically assigns it to ONE category based on the content.

### How Categories Work

1. **You define categories** in `config/categories.json`
2. **Gemini reads the categories** and their descriptions when processing audio
3. **Gemini assigns ONE category** to each voice note based on the content
4. **The category is saved** to your Notion database

### Why Category Descriptions Matter

Category descriptions are **critical** for helping Gemini AI choose the right category. The descriptions:

- Guide Gemini's understanding of what each category represents
- Should be clear, specific, and descriptive
- Are written in English (for AI processing)
- Are NOT shown to end users (only used internally)

**Example:**
```json
{
  "name": "Project",
  "description": "Business ideas, app ideas, work projects, startups, brainstorming, entrepreneurship, product development"
}
```

Gemini reads the description to understand that voice notes about business ideas should be categorized as "Project".

---

## Step-by-Step Guide

### Step 1: Create Your Configuration File

The repository includes `config/categories.example.json` as a template. This file is **NOT git-ignored** and serves as the default fallback.

**Create your own customizable config:**

```bash
cp config/categories.example.json config/categories.json
```

Your `config/categories.json` file **IS git-ignored**, so you can customize it without Git conflicts.

### Step 2: Edit Categories in the Config File

Open `config/categories.json` in your text editor:

```json
{
  "categories": [
    {
      "name": "Project",
      "icon": "🚀",
      "description": "Business ideas, app ideas, work projects, startups, brainstorming"
    },
    {
      "name": "Learning",
      "icon": "📚",
      "description": "Study notes, education, courses, tutorials, knowledge acquisition"
    }
  ]
}
```

**Important rules:**

- ✅ Category names are **case-sensitive** (e.g., "Project" ≠ "project")
- ✅ Category names must match **exactly** in Notion
- ✅ At least **1 category** is required
- ✅ Maximum **20 categories** recommended (for AI accuracy)
- ✅ Icons should be single emojis
- ✅ Descriptions should be clear and specific

### Step 3: Update Your Notion Database

**CRITICAL:** Your Notion database Category property must match your config file exactly.

1. **Open your Notion database** (the one specified in `NOTION_DATABASE_ID`)
2. **Click on the "Category" property** (select type)
3. **Edit the options** to match your config file:
   - Add new categories
   - Rename existing categories (must match case-sensitive)
   - Remove categories you don't want
   - Option colors don't matter (Athan uses icons instead)

**Example Notion Category property setup:**
```
Category (Select property)
  ├── Project (any color)
  ├── Learning (any color)
  ├── Personal (any color)
  └── Task (any color)
```

**IMPORTANT:** The category **names** must match exactly:
- ❌ "project" (lowercase) vs ✅ "Project" (capitalized)
- ❌ "Projects" (plural) vs ✅ "Project" (singular)
- ❌ "Work" vs ✅ "Project"

### Step 4: Restart the Application

Changes to `config/categories.json` are loaded when the app starts.

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

### Step 5: Verify It Works

1. **Record a test voice note** (or use the API endpoint)
2. **Check the console** for any category validation warnings
3. **Verify in Notion** that the correct category was assigned
4. **If issues occur**, see [Troubleshooting](#troubleshooting)

---

## Category Configuration Format

### JSON Structure

```json
{
  "categories": [
    {
      "name": "string (required)",
      "icon": "emoji (required)",
      "description": "string (required)"
    }
  ]
}
```

### Field Specifications

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ Yes | Exact category name (case-sensitive). Must match Notion database. |
| `icon` | string | ✅ Yes | Single emoji icon (e.g., "🚀", "📚", "✨"). Shown in Notion pages. |
| `description` | string | ✅ Yes | Detailed description for Gemini AI. Helps AI categorize correctly. |

### Example

```json
{
  "categories": [
    {
      "name": "Work",
      "icon": "💼",
      "description": "Work-related tasks, projects, meetings, professional development, career goals, job responsibilities"
    },
    {
      "name": "Health",
      "icon": "🏃",
      "description": "Exercise routines, meal planning, medical appointments, mental health, wellness goals, fitness tracking"
    },
    {
      "name": "Creative",
      "icon": "🎨",
      "description": "Art projects, music, writing, design work, creative hobbies, artistic inspiration, creative ideas"
    }
  ]
}
```

---

## Category Descriptions

### Writing Effective Descriptions

Category descriptions guide Gemini AI in making the right categorization decisions. Follow these guidelines:

**✅ Good descriptions are:**
- Specific and detailed
- List concrete examples and keywords
- Cover the scope of the category
- Written in clear English
- Comma-separated lists of related concepts

**❌ Avoid:**
- Vague descriptions ("stuff", "things", "notes")
- Single-word descriptions
- Overlapping categories (creates confusion)
- Non-English descriptions (Gemini prompt is in English)

### Examples

**Good:**
```json
{
  "name": "Business",
  "description": "Business ideas, startup planning, entrepreneurship, revenue models, market research, customer development, product strategy, business meetings, investment, fundraising"
}
```

**Not recommended:**
```json
{
  "name": "Business",
  "description": "Business stuff"
}
```

### Category Overlap

If categories overlap too much, Gemini may struggle to choose correctly. Design categories with clear boundaries:

**Problematic overlap:**
```json
[
  { "name": "Work", "description": "Work tasks, projects, meetings" },
  { "name": "Projects", "description": "Project ideas, work projects" }
]
```

**Better separation:**
```json
[
  { "name": "Work", "description": "Daily work tasks, meetings, professional responsibilities, job duties" },
  { "name": "Projects", "description": "Personal side projects, hobby projects, creative projects, experiments" }
]
```

---

## Adding New Categories

### Example: Adding a "Health" category

1. **Edit `config/categories.json`:**

```json
{
  "categories": [
    {
      "name": "Project",
      "icon": "🚀",
      "description": "Business ideas, app ideas, work projects, startups"
    },
    {
      "name": "Health",
      "icon": "🏃",
      "description": "Exercise routines, meal planning, medical appointments, wellness goals, fitness tracking"
    }
  ]
}
```

2. **Add to Notion database:**
   - Open your Notion database
   - Click Category property → Edit property
   - Click "+ Add an option"
   - Type "Health" (exact match with config)
   - Choose any color (icon from config will be used)
   - Click outside to save

3. **Restart app and test**

---

## Editing Existing Categories

### Renaming a Category

**IMPORTANT:** Renaming requires updating **BOTH** config and Notion.

1. **Update `config/categories.json`:**
```json
{
  "name": "Work Projects",  // Changed from "Project"
  "icon": "💼",
  "description": "..."
}
```

2. **Update Notion database:**
   - Open Category property settings
   - Find the old category name
   - Click to edit, rename to "Work Projects"
   - Save

3. **Existing pages:** Notion will automatically update existing pages with the renamed category

### Changing Icon or Description

Icons and descriptions are only stored in `config/categories.json`, so just edit the file and restart:

```json
{
  "name": "Project",
  "icon": "💡",  // Changed from 🚀
  "description": "Updated description with more context"
}
```

No Notion changes needed for icon/description updates.

---

## Removing Categories

### Safe Removal Process

1. **Check Notion database** for any existing pages using the category
2. **Reassign those pages** to other categories (manually in Notion)
3. **Remove from `config/categories.json`:**

```json
{
  "categories": [
    // Removed "Task" category
    { "name": "Project", "icon": "🚀", "description": "..." },
    { "name": "Learning", "icon": "📚", "description": "..." }
  ]
}
```

4. **Remove from Notion database:**
   - Open Category property → Edit property
   - Click "..." next to the category
   - Click "Delete"
   - Confirm deletion

5. **Restart app**

**⚠️ WARNING:** If you remove a category from config but not from Notion, existing pages with that category will still exist but new pages won't use it.

---

## Troubleshooting

### Issue: "No config/categories.json found" warning

**Cause:** You haven't created your custom config file yet.

**Solution:**
```bash
cp config/categories.example.json config/categories.json
```

The app will use `categories.example.json` as a fallback, but you should create your own `categories.json` for customization.

---

### Issue: "Invalid category, falling back to: Personal"

**Cause:** Gemini returned a category that doesn't exist in your Notion database.

**Possible reasons:**
1. Category name mismatch (case-sensitive)
2. Category exists in config but not in Notion
3. Typo in category name

**Solution:**
1. Check console logs for the exact category Gemini returned
2. Verify category exists in Notion with **exact same name** (case-sensitive)
3. Ensure config and Notion are synchronized

---

### Issue: Gemini choosing wrong category

**Cause:** Category descriptions may be unclear or overlapping.

**Solution:**
1. **Review descriptions:** Make them more specific and detailed
2. **Check for overlap:** Ensure categories have clear boundaries
3. **Test with examples:** Record test notes and see which category gets assigned
4. **Refine descriptions:** Add more keywords that represent the category

**Example improvement:**

Before:
```json
{
  "name": "Personal",
  "description": "Personal stuff and thoughts"
}
```

After:
```json
{
  "name": "Personal",
  "description": "Private thoughts, diary entries, personal reflections, emotions, daily experiences, journaling, feelings, personal growth, relationships, life events"
}
```

---

### Issue: Categories not loading after changes

**Cause:** Categories are cached and app needs restart.

**Solution:**
```bash
# Stop the app (Ctrl+C)
npm run dev  # Or npm start for production
```

---

### Issue: JSON parse error

**Cause:** Invalid JSON syntax in `config/categories.json`.

**Common mistakes:**
- Missing comma between objects
- Trailing comma at end of array
- Missing quotes around strings
- Unclosed brackets

**Solution:**
1. Validate JSON syntax using an online JSON validator
2. Compare with `categories.example.json` format
3. Check error message for line number

**Example of invalid JSON:**
```json
{
  "categories": [
    {
      "name": "Project",
      "icon": "🚀",
      "description": "..."
    }  // ❌ Missing comma here
    {
      "name": "Learning",
      "icon": "📚",
      "description": "..."
    }
  ]
}
```

**Fixed:**
```json
{
  "categories": [
    {
      "name": "Project",
      "icon": "🚀",
      "description": "..."
    },  // ✅ Comma added
    {
      "name": "Learning",
      "icon": "📚",
      "description": "..."
    }
  ]
}
```

---

## Example Category Sets

### Default Set (4 categories)

Balanced set for general note-taking:

```json
{
  "categories": [
    {
      "name": "Project",
      "icon": "🚀",
      "description": "Business ideas, app ideas, work projects, startups, brainstorming, entrepreneurship, product development"
    },
    {
      "name": "Learning",
      "icon": "📚",
      "description": "Study notes, education, courses, tutorials, knowledge acquisition, research, books, skills development"
    },
    {
      "name": "Personal",
      "icon": "✨",
      "description": "Private thoughts, diary entries, personal reflections, emotions, daily experiences, journaling"
    },
    {
      "name": "Task",
      "icon": "✅",
      "description": "To-dos, action items, reminders, checklists, things to complete, errands, responsibilities"
    }
  ]
}
```

### Extended Set (8 categories)

For power users who want more granular organization:

```json
{
  "categories": [
    {
      "name": "Work",
      "icon": "💼",
      "description": "Job tasks, professional responsibilities, work meetings, career development, workplace issues"
    },
    {
      "name": "Business",
      "icon": "🚀",
      "description": "Business ideas, startup planning, entrepreneurship, side hustles, business strategy"
    },
    {
      "name": "Learning",
      "icon": "📚",
      "description": "Study notes, courses, tutorials, books, educational content, skill development"
    },
    {
      "name": "Creative",
      "icon": "🎨",
      "description": "Creative projects, art, music, writing, design, creative hobbies, inspiration"
    },
    {
      "name": "Health",
      "icon": "🏃",
      "description": "Exercise, fitness, meal planning, medical appointments, wellness, mental health"
    },
    {
      "name": "Personal",
      "icon": "✨",
      "description": "Personal reflections, diary entries, emotions, relationships, life events"
    },
    {
      "name": "Tasks",
      "icon": "✅",
      "description": "To-dos, action items, reminders, checklists, errands, responsibilities"
    },
    {
      "name": "Ideas",
      "icon": "💡",
      "description": "Random ideas, brainstorming, inspiration, creative thoughts, future possibilities"
    }
  ]
}
```

### Minimal Set (2 categories)

For users who want simple organization:

```json
{
  "categories": [
    {
      "name": "Action",
      "icon": "✅",
      "description": "Tasks, to-dos, action items, things to complete, projects, work items"
    },
    {
      "name": "Notes",
      "icon": "📝",
      "description": "General notes, thoughts, ideas, reflections, learning, personal entries"
    }
  ]
}
```

### Developer-Focused Set

For software developers:

```json
{
  "categories": [
    {
      "name": "Code",
      "icon": "💻",
      "description": "Coding ideas, programming concepts, technical solutions, algorithms, debugging notes"
    },
    {
      "name": "Learning",
      "icon": "📚",
      "description": "Technical tutorials, courses, documentation notes, new technologies, frameworks"
    },
    {
      "name": "Projects",
      "icon": "🚀",
      "description": "Project ideas, app concepts, features to build, side projects, experiments"
    },
    {
      "name": "Tasks",
      "icon": "✅",
      "description": "Development tasks, bugs to fix, features to implement, code reviews, deployments"
    },
    {
      "name": "Personal",
      "icon": "✨",
      "description": "Personal notes, reflections, non-technical thoughts, daily experiences"
    }
  ]
}
```

### Student-Focused Set

For students and academics:

```json
{
  "categories": [
    {
      "name": "Lectures",
      "icon": "🎓",
      "description": "Lecture notes, class discussions, professor explanations, course content"
    },
    {
      "name": "Study",
      "icon": "📚",
      "description": "Study notes, exam preparation, review materials, concepts to memorize"
    },
    {
      "name": "Research",
      "icon": "🔬",
      "description": "Research notes, academic papers, thesis ideas, experiments, findings"
    },
    {
      "name": "Assignments",
      "icon": "✍️",
      "description": "Homework, assignments, projects, deadlines, things to submit"
    },
    {
      "name": "Personal",
      "icon": "✨",
      "description": "Personal thoughts, reflections, extracurricular activities, social events"
    }
  ]
}
```

---

## Best Practices

### 1. Keep It Simple

Start with 3-5 categories. You can always add more later.

### 2. Make Categories Distinct

Avoid overlap. Each category should have a clear, unique purpose.

### 3. Use Descriptive Icons

Choose emojis that visually represent the category at a glance.

### 4. Write Detailed Descriptions

The better your descriptions, the better Gemini categorizes your notes.

### 5. Test and Iterate

Record test notes, see how they're categorized, and adjust descriptions as needed.

### 6. Keep Config and Notion in Sync

Always update both `config/categories.json` AND your Notion database when making changes.

### 7. Document Your Categories

If sharing with a team, document what each category represents.

---

## Need Help?

If you encounter issues not covered in this guide:

1. Check the [main README](../README.md) for general setup issues
2. Review error messages in the console
3. Verify JSON syntax is valid
4. Ensure config and Notion database match exactly (case-sensitive)
5. Open an issue on GitHub with:
   - Your `categories.json` (remove sensitive data)
   - Error messages from console
   - Steps to reproduce the issue

---

## Summary

**Remember these key points:**

1. ✅ Copy `categories.example.json` to `categories.json`
2. ✅ Edit `categories.json` with your categories
3. ✅ Update Notion database to match (case-sensitive)
4. ✅ Restart the app
5. ✅ Category names must match EXACTLY
6. ✅ Descriptions guide Gemini AI
7. ✅ Icons are visual indicators in Notion

Happy organizing! 🎉

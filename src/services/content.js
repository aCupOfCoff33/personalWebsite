// ============================================================================
// CENTRALIZED CONTENT SERVICE
// ============================================================================
// This is your SINGLE interface for ALL data access across the entire app.
// All components should import from HERE, not directly from data files.
//
// Benefits:
// 1. When you migrate to a database, you ONLY change THIS file
// 2. No component needs to know where data comes from
// 3. Easy to add caching, filtering, sorting logic here
// 4. Single source of truth
//
// Usage in components:
//   import { contentService } from '@/services/content';
//   const experiences = await contentService.getExperiences();
// ============================================================================

import { experiences } from '../data/experiences';
import { projects } from '../data/projects';
import { storiesData } from '../data/stories';
import { aboutImages } from '../data/aboutImages';
import { notesIndex, getNoteBySlug as getNoteMock } from '../data/notes';

/**
 * Content Service
 * Single interface for all content data across the application
 *
 * Future migration: Replace the data imports with API calls to your database
 */
export const contentService = {
  // ==========================================================================
  // EXPERIENCES
  // ==========================================================================

  /**
   * Get all experiences with optional filtering
   * @param {Object} filters - Optional filters
   * @param {string} filters.category - Filter by category ('internship', 'leadership', 'consulting')
   * @param {boolean} filters.featured - Filter to only featured items
   * @param {boolean} filters.isActive - Filter to only active items (default: true)
   * @returns {Promise<Array>} Array of experience objects
   */
  async getExperiences(filters = {}) {
    // Simulate async behavior (useful when migrating to real API)
    return new Promise((resolve) => {
      let data = [...experiences];

      // Apply filters
      if (filters.category) {
        data = data.filter(exp => exp.category === filters.category);
      }

      if (filters.featured !== undefined) {
        data = data.filter(exp => exp.featured === filters.featured);
      }

      if (filters.isActive !== false) {
        data = data.filter(exp => exp.isActive === true);
      }

      // Sort by sortOrder
      data.sort((a, b) => a.sortOrder - b.sortOrder);

      resolve(data);
    });
  },

  /**
   * Get a single experience by ID
   * @param {string} id - Experience ID
   * @returns {Promise<Object|null>} Experience object or null if not found
   */
  async getExperienceById(id) {
    return new Promise((resolve) => {
      const experience = experiences.find(exp => exp.id === id);
      resolve(experience || null);
    });
  },

  // ==========================================================================
  // PROJECTS
  // ==========================================================================

  /**
   * Get all projects with optional filtering
   * @param {Object} filters - Optional filters
   * @param {string} filters.category - Filter by category
   * @param {boolean} filters.featured - Filter to only featured items
   * @param {boolean} filters.isActive - Filter to only active items (default: true)
   * @returns {Promise<Array>} Array of project objects
   */
  async getProjects(filters = {}) {
    return new Promise((resolve) => {
      let data = [...projects];

      if (filters.category) {
        data = data.filter(proj => proj.category === filters.category);
      }

      if (filters.featured !== undefined) {
        data = data.filter(proj => proj.featured === filters.featured);
      }

      if (filters.isActive !== false) {
        data = data.filter(proj => proj.isActive === true);
      }

      // Sort by sortOrder
      data.sort((a, b) => a.sortOrder - b.sortOrder);

      resolve(data);
    });
  },

  /**
   * Get a single project by ID
   * @param {string} id - Project ID
   * @returns {Promise<Object|null>} Project object or null if not found
   */
  async getProjectById(id) {
    return new Promise((resolve) => {
      const project = projects.find(proj => proj.id === id);
      resolve(project || null);
    });
  },

  // ==========================================================================
  // STORIES
  // ==========================================================================

  /**
   * Get all stories with optional filtering
   * @param {Object} filters - Optional filters
   * @param {string} filters.category - Filter by category
   * @param {string} filters.accent - Filter by accent color
   * @returns {Promise<Array>} Array of story objects
   */
  async getStories(filters = {}) {
    return new Promise((resolve) => {
      let data = [...storiesData];

      if (filters.category) {
        data = data.filter(story => story.category === filters.category);
      }

      if (filters.accent) {
        data = data.filter(story => story.accent === filters.accent);
      }

      resolve(data);
    });
  },

  /**
   * Get a single story by ID
   * @param {string} id - Story ID
   * @returns {Promise<Object|null>} Story object or null if not found
   */
  async getStoryById(id) {
    return new Promise((resolve) => {
      const story = storiesData.find(s => s.id === id);
      resolve(story || null);
    });
  },

  // ==========================================================================
  // NOTES / CASE STUDIES
  // ==========================================================================

  /**
   * Get all notes
   * @returns {Promise<Array>} Array of note objects
   */
  async getNotes() {
    return new Promise((resolve) => {
      resolve([...notesIndex]);
    });
  },

  /**
   * Get a single note by slug
   * @param {string} slug - Note slug
   * @returns {Promise<Object|null>} Note object or null if not found
   */
  async getNoteBySlug(slug) {
    return getNoteMock(slug);
  },

  // ==========================================================================
  // ABOUT IMAGES
  // ==========================================================================

  /**
   * Get all about page images
   * @returns {Promise<Array>} Array of image objects
   */
  async getAboutImages() {
    return new Promise((resolve) => {
      resolve([...aboutImages]);
    });
  },

  // ==========================================================================
  // COMBINED / UTILITY METHODS
  // ==========================================================================

  /**
   * Get all content items (projects + stories) for display in carousels
   * Useful for homepage or combined views
   * @returns {Promise<Object>} Object with projects and stories arrays
   */
  async getAllContent() {
    const [projectsList, storiesList] = await Promise.all([
      this.getProjects({ featured: true }),
      this.getStories(),
    ]);

    return {
      projects: projectsList,
      stories: storiesList,
    };
  },

  /**
   * Search across all content types
   * @param {string} query - Search query
   * @returns {Promise<Object>} Object with matching results from each content type
   */
  async search(query) {
    if (!query || query.trim() === '') {
      return {
        experiences: [],
        projects: [],
        stories: [],
        notes: [],
      };
    }

    const searchTerm = query.toLowerCase().trim();

    const [allExperiences, allProjects, allStories, allNotes] = await Promise.all([
      this.getExperiences(),
      this.getProjects(),
      this.getStories(),
      this.getNotes(),
    ]);

    return {
      experiences: allExperiences.filter(exp =>
        exp.companyName.toLowerCase().includes(searchTerm) ||
        exp.position.toLowerCase().includes(searchTerm) ||
        exp.description.toLowerCase().includes(searchTerm)
      ),
      projects: allProjects.filter(proj =>
        proj.title.toLowerCase().includes(searchTerm) ||
        proj.description.toLowerCase().includes(searchTerm)
      ),
      stories: allStories.filter(story =>
        story.title.toLowerCase().includes(searchTerm) ||
        story.category.toLowerCase().includes(searchTerm)
      ),
      notes: allNotes.filter(note =>
        note.title.toLowerCase().includes(searchTerm) ||
        note.summary.toLowerCase().includes(searchTerm)
      ),
    };
  },
};

export default contentService;

// ============================================================================
// FUTURE MIGRATION EXAMPLE
// ============================================================================
// When you're ready to connect to a database, replace the implementations above
// with actual API calls. For example:
//
// async getExperiences(filters = {}) {
//   const response = await fetch('/api/experiences', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(filters)
//   });
//   return response.json();
// }
//
// OR with Sanity:
//
// import { sanityClient } from './sanity';
//
// async getExperiences(filters = {}) {
//   const query = `*[_type == "experience" && isActive == true] | order(sortOrder asc)`;
//   return await sanityClient.fetch(query);
// }
//
// The beauty is: NO component needs to change. Only this file.
// ============================================================================

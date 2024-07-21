import {defineType} from 'sanity'

export const bioType = defineType({
  title: 'Bio',
  name: 'bio',
  type: 'document',
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'document',
      fields: [
        {
          title: 'ko',
          name: 'ko',
          type: 'string',
        },
        {
          title: 'en',
          name: 'en',
          type: 'string',
        },
      ],
    },
    {
      title: 'Job',
      name: 'job',
      type: 'string',
    },
    {
      title: 'About',
      name: 'about',
      type: 'document',
      fields: [
        {
          title: 'ko',
          name: 'ko',
          type: 'string',
        },
        {
          title: 'en',
          name: 'en',
          type: 'string',
        },
      ],
    },
    {
      title: 'Hero',
      name: 'hero',
      type: 'document',
      fields: [
        {
          title: 'ko',
          name: 'ko',
          type: 'string',
        },
        {
          title: 'en',
          name: 'en',
          type: 'string',
        },
      ],
    },
    {
      title: 'Skills',
      name: 'Skills',
      type: 'array',
      of: [
        {
          title: 'Skill',
          name: 'skill',
          type: 'string',
        },
      ],
    },
  ],
})

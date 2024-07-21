import {defineType} from 'sanity'

export const experienceType = defineType({
  title: 'Experience',
  name: 'experience',
  type: 'document',
  fields: [
    {
      title: 'role',
      name: 'role',
      type: 'string',
    },
    {
      title: 'Company',
      name: 'Company',
      type: 'string',
    },
    {
      title: 'Start',
      name: 'start',
      type: 'string',
    },
    {
      title: 'End',
      name: 'end',
      type: 'string',
    },
    {
      title: 'Description',
      name: 'description',
      type: 'document',
      fields: [
        {
          title: 'ko',
          name: 'ko',
          type: 'array',
          of: [
            {
              title: 'Comment',
              name: 'comment',
              type: 'string',
            },
          ],
        },
        {
          title: 'en',
          name: 'en',
          type: 'array',
          of: [
            {
              title: 'Comment',
              name: 'comment',
              type: 'string',
            },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'role',
      subtitle: 'Company',
    },
  },
})

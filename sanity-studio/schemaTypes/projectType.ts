import {defineType} from 'sanity'

export const projectType = defineType({
  title: 'Project',
  name: 'project',
  type: 'document',
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'string',
    },
    {
      title: 'isToyProject',
      name: 'isToyProject',
      type: 'boolean',
    },
    {
      title: 'Company',
      name: 'company',
      type: 'string',
    },
    {
      title: 'Link',
      name: 'link',
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
      title: 'Photo',
      name: 'photo',
      type: 'image',
    },
    {
      title: 'Keywords',
      name: 'keywords',
      type: 'array',
      of: [
        {
          title: 'Keyword',
          name: 'keyword',
          type: 'string',
        },
      ],
    },
  ],
})

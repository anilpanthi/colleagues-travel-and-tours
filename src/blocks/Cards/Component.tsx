import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import type { CardsBlock as CardBlockProps, Config } from '@/payload-types'
import Cards from '@/components/ui/Card/Cards'

export const CardsBlock: React.FC<CardBlockProps> = async (props) => {
  const {
    selectedItems: selectedItemsFromProps,
    cards,
    enableLink,
    collection,
    populateBy,
    limit,
    link,
    columns,
  } = props

  if (!cards || cards === 'none') return null

  let items = selectedItemsFromProps

  if (populateBy === 'selection' && items && items.length > 0) {
    const payload = await getPayload({ config: configPromise })

    // Group items by collection to perform bulk fetches
    const itemsByCollection: Record<string, (string | number)[]> = {}
    items.forEach((item) => {
      if (!item) return
      const id = typeof item.value === 'object' ? item.value.id : item.value
      if (!itemsByCollection[item.relationTo]) {
        itemsByCollection[item.relationTo] = []
      }
      itemsByCollection[item.relationTo].push(id)
    })

    // Fetch fresh documents for each collection in parallel
    const collectionResults = await Promise.all(
      Object.keys(itemsByCollection).map(async (collectionSlug) => {
        try {
          const result = await payload.find({
            collection: collectionSlug as keyof Config['collections'],
            depth: 2,
            pagination: false,
            where: {
              id: {
                in: itemsByCollection[collectionSlug],
              },
            },
          })
          return { collectionSlug, docs: result.docs }
        } catch (err) {
          console.error(`Error fetching items for collection ${collectionSlug}:`, err)
          return { collectionSlug, docs: [] }
        }
      }),
    )

    // Create a lookup map for the fetched documents
    const docsMap: Record<string, Record<string | number, any>> = {}
    collectionResults.forEach((res) => {
      docsMap[res.collectionSlug] = {}
      res.docs.forEach((doc) => {
        docsMap[res.collectionSlug][doc.id] = doc
      })
    })

    // Update items with fresh data while preserving order
    items = items.map((item) => {
      if (!item) return item
      const id = typeof item.value === 'object' ? item.value.id : item.value
      const freshDoc = docsMap[item.relationTo]?.[id]

      return {
        ...item,
        value: freshDoc || item.value,
      }
    }) as CardBlockProps['selectedItems']
  }
  if (populateBy === 'collection' && collection && collection !== 'none') {
    const payload = await getPayload({ config: configPromise })
    const fetchedItems = await payload.find({
      collection: collection as keyof Config['collections'],
      depth: 2,
      limit: limit || 10,
      sort: '-createdAt',
    })
    items = fetchedItems.docs.map(
      (doc) =>
        ({
          value: doc,
        }) as NonNullable<CardBlockProps['selectedItems']>[number],
    )
  }

  return (
    <Cards
      collection={collection}
      selectedItems={items}
      variant={cards}
      enableLink={enableLink}
      link={link}
      columns={columns}
    />
  )
}

export default CardsBlock

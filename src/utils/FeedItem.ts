
type FeedItem = {
  type: 'blog' | 'pkg' |'mash' | 'highlight'
  url: string,
  title: string,
  time: Date,
  image?: string
  description?: string
}

export default FeedItem

import React from 'react'
import BlockContent from '../blocks/content/View'
import BlockGrid from '../blocks/grid'
import StepperGrid from '../blocks/stepper'

// import Directory from '../components/directory';
import BlockHero from '../blocks/hero/View'
import BlockImage from '../blocks/image/View'
import BlockVideo from '../blocks/video/View'
// import BlockRichText from '../components/Blocks/RichText';

export default (props) => {
  const { blocks, slug } = props

  const renderBlock = (block, index) => {
    switch (block.__component) {
      case 'blocks.content':
        return (
          <BlockContent
            {...block}
            key={`${block.__component}-${index}`}
            slug={slug}
          />
        )
      case 'blocks.hero':
        return (
          <BlockHero
            {...block}
            key={`${block.__component}-${index}`}
            slug={slug}
          />
        )
      case 'blocks.image':
        return (
          <BlockImage
            {...block}
            key={`${block.__component}-${index}`}
            slug={slug}
          />
        )
      case 'blocks.video':
        return (
          <BlockVideo
            {...block}
            key={`${block.__component}-${index}`}
            slug={slug}
          />
        )
      case 'blocks.grid':
        return (
          <BlockGrid
            {...block}
            key={`${block.__component}-${index}`}
            slug={slug}
          />
        )
      case 'blocks.stepper':
        return (
          <StepperGrid
            {...block}
            key={`${block.__component}-${index}`}
            slug={slug}
          />
        )
      default:
        return (
          <BlockContent
            {...block}
            key={`${block.__component}-${index}`}
            slug={slug}
          />
        )
    }
  }

  return blocks.map(renderBlock)
}

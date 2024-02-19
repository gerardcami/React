import { useCatImage } from '../../hooks/useCatImage'

export function Otro () {
  const { imageUrl } = useCatImage({ fact: 'Cat' })

  return (
    <>
      {imageUrl && <img src={imageUrl} />}
    </>
  )
}

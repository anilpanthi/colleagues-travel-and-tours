import Slot from "./Slot"

export function createCardSlot(
  defaultTag: React.ElementType,
  className: string
) {
  return function CardSlot({
    as = defaultTag,
    children,
    ...props
  }: any) {
    return (
      <Slot as={as} className={className} {...props}>
        {children}
      </Slot>
    )
  }
}
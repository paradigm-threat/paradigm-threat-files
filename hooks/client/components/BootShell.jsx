import RelayBootShell from '@relay/ui/RelayBootShell'

export default function BootShell(props) {
  const children = props.children
  return (
    <RelayBootShell brand="Paradigm Threat">
      {children}
    </RelayBootShell>
  )
}

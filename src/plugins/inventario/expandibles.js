//este bloque de codigo es un copy-paste para animacion al expandir un row en datatable
const getItemId = function(item) {
    return item.id // Must be uid of record (would be nice if v-data-table exposed a "getItemKey" method)
  };

const toggleExpand = function(props) {
    const item = props.item
    const id = this.getItemId(item)
    if (props.isExpanded && this.transitioned[id]) {
      // If we're expanded and not in the process of closing, close
      this.closeExpand(item)
    } else {
      // If we're closed or in the process of closing, expand
      // Stop us from closing if a close transition was started
      clearTimeout(this.closeTimeouts[id])
      // Tell v-data-table to add the expansion content for the item
      props.expand(true)
      // Show expansion content with transition animation after it's had time to get added to the DOM
      this.$nextTick(() => this.$set(this.transitioned, id, true))
      // Hide all other expanded items if single-expand
      if (this.singleExpand) this.$nextTick(() => this.expanded.forEach(i => i !== item && this.closeExpand(i)))
    }
  };

const closeExpand = function(item) {
    const id = this.getItemId(item)
    // Mark that this item is in the process of closing
    this.$set(this.transitioned, id, false)
    // Remove expansion content from DOM after transition animation has had enough time to finish
    this.closeTimeouts[id] = setTimeout(() => this.$refs.Inventario.expand(item, false), 600)
  };

export default { getItemId , toggleExpand, closeExpand};
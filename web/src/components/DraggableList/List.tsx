import * as React from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FolderIcon from '@mui/icons-material/Folder'
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
} from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DroppableProvided,
  DraggableProvided,
} from 'react-beautiful-dnd'

interface Item {
  id: string
  primary: string
  secondary?: string
}

interface DraggableListProps {
  items: Item[]
  handleDelete: (id: string) => void
  handleUpdateOrderSubjects: (data) => void
}

const DraggableList: React.FC<DraggableListProps> = ({
  items,
  handleDelete,
  handleUpdateOrderSubjects,
}) => {
  const [orderedItems, setOrderedItems] = React.useState<Item[]>([])
  React.useEffect(() => {
    if (items) {
      setOrderedItems(items)
    }
  }, [items])
  // const [dense, setDense] = React.useState(false)
  // const [secondary, setSecondary] = React.useState(false)
  const dense = false // or false, depending on your needs
  const secondary = false

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return
    }

    const fromIndex = result.source.index
    const toIndex = result.destination.index

    if (fromIndex !== toIndex) {
      const newOrderedItems = Array.from(orderedItems)
      const [movedItem] = newOrderedItems.splice(fromIndex, 1)
      newOrderedItems.splice(toIndex, 0, movedItem)

      //Find the two items that have changed positions
      const updatedItems = newOrderedItems.map((item, index) => ({
        ...item,
        order: index + 1,
      }))
      console.log(newOrderedItems)
      // Update local state
      setOrderedItems(newOrderedItems)
      console.log(updatedItems)
      // Call function to update the backend
      handleUpdateOrderSubjects(updatedItems)
    }
  }
  console.log(items)
  return (
    <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="list">
          {(provided: DroppableProvided) => (
            <Box
              sx={{ flexGrow: 1, maxWidth: 752 }}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <List dense={dense}>
                {Array.isArray(orderedItems) ? (
                  orderedItems.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided: DraggableProvided) => (
                        <Accordion
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel${index}-content`}
                            id={`panel${index}-header`}
                          >
                            <ListItemAvatar>
                              <Avatar>
                                <FolderIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={item.primary}
                              secondary={secondary ? 'Secondary text' : null}
                            />
                          </AccordionSummary>
                          <AccordionDetails>
                            {item.secondary ? item.secondary : 'No description'}
                          </AccordionDetails>
                          <AccordionActions>
                            <IconButton edge="end" aria-label="delete">
                              <DeleteIcon
                                onClick={() => handleDelete(item.id)}
                              />
                            </IconButton>
                          </AccordionActions>
                        </Accordion>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <p>Loading...</p>
                )}
                {provided.placeholder}
              </List>
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  )
}

export default DraggableList

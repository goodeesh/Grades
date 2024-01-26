import * as React from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FolderIcon from '@mui/icons-material/Folder'
import SaveIcon from '@mui/icons-material/Save'
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
import { Formik, Field, Form } from 'formik'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DroppableProvided,
  DraggableProvided,
} from 'react-beautiful-dnd'

import { MyField } from '../Forms/NewClass/MyField'

interface Item {
  id: string
  primary: string
  secondary?: string
  order: number
}

interface DraggableListProps {
  items: Item[]
  handleDelete: (id: string) => void
  handleUpdateOrderSubjects: (data) => void
  handleNameDescription: (id, input) => void
}

const DraggableList: React.FC<DraggableListProps> = ({
  items,
  handleDelete,
  handleUpdateOrderSubjects,
  handleNameDescription,
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

      // Set the order property of each item to its index in the array plus 1
      for (let i = 0; i < newOrderedItems.length; i++) {
        newOrderedItems[i].order = i + 1
      }

      // Update local state
      setOrderedItems(newOrderedItems)

      // Call function to update the backend
      handleUpdateOrderSubjects(newOrderedItems)
    }
  }
  const [editingItem, setEditingItem] = React.useState(null)

  const handleEdit = (id) => {
    setEditingItem(id)
  }
  const [expandedItem, setExpandedItem] = React.useState(null)

  const handleAccordionChange = (id) => (event, isExpanded) => {
    setExpandedItem(isExpanded ? id : false)
  }

  const handleSave = (item) => {
    handleNameDescription(item.id, {
      name: item.primary,
      description: item.secondary,
    })
    // Save your changes here
    setEditingItem(null)
  }
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
                    <Formik
                      key={item.id}
                      initialValues={item}
                      onSubmit={handleSave}
                      enableReinitialize
                    >
                      {({ handleSubmit }) => (
                        <Draggable draggableId={item.id} index={index}>
                          {(provided: DraggableProvided) => (
                            <Form onSubmit={handleSubmit} key={editingItem}>
                              {' '}
                              <Accordion
                                key={item.id}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                expanded={expandedItem === item.id}
                                onChange={handleAccordionChange(item.id)}
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
                                  {editingItem === item.id ? (
                                    <Box
                                      width="100%"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Field
                                        name="primary"
                                        component={MyField}
                                      />
                                    </Box>
                                  ) : (
                                    <Box width="100%">
                                      <ListItemText
                                        primary={item.primary}
                                        secondary={
                                          secondary ? 'Secondary text' : null
                                        }
                                      />
                                    </Box>
                                  )}
                                </AccordionSummary>
                                <AccordionDetails>
                                  {editingItem === item.id ? (
                                    <Box width="100%">
                                      <Field
                                        name="secondary"
                                        component={MyField}
                                      />
                                    </Box>
                                  ) : item.secondary ? (
                                    item.secondary
                                  ) : (
                                    'No description'
                                  )}
                                </AccordionDetails>
                                <AccordionActions>
                                  <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => handleDelete(item.id)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                  {editingItem === item.id ? (
                                    <IconButton aria-label="save" type="submit">
                                      <SaveIcon />
                                    </IconButton>
                                  ) : (
                                    <IconButton
                                      aria-label="edit"
                                      onClick={() => handleEdit(item.id)}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                  )}
                                </AccordionActions>
                              </Accordion>
                            </Form>
                          )}
                        </Draggable>
                      )}
                    </Formik>
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

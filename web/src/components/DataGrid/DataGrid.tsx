import * as React from 'react'

import AddIcon from '@mui/icons-material/Add'
import CancelIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import { Grid, ListItemIcon, ListItemText, MenuItem } from '@mui/material'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import TextField from '@mui/material/TextField'
import {
  DataGrid,
  GridColDef,
  GridRowModesModel,
  GridToolbarContainer,
  GridRowsProp,
  GridRowEditStopReasons,
  GridRowModes,
  GridActionsCellItem,
  GridColumnMenu,
  GridColumnMenuItemProps,
  GridColumnMenuProps,
} from '@mui/x-data-grid'
interface CustomDataGridProps {
  rows: GridRowsProp
  columns: GridColDef[]
}

const EditToolbar = React.memo(function EditToolbar({
  setRows,
  addNewColumn,
  onSearchChange,
  searchText,
}: {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void
  addNewColumn: () => void
  onSearchChange: (searchValue: string) => void
  searchText: string
}) {
  const handleAddRecord = () => {
    setRows((oldRows) => {
      const maxId = oldRows.reduce((max, row) => Math.max(max, row.id), 0)
      const newId = maxId + 1
      return [...oldRows, { id: newId, name: '', age: '', isNew: true }]
    })
  }

  const searchInputRef = React.useRef<HTMLInputElement | null>(null)

  React.useEffect(() => {
    searchInputRef.current.focus()
  }, [searchText])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value)
  }

  return (
    <GridToolbarContainer>
      <TextField
        inputRef={searchInputRef}
        value={searchText}
        onInput={handleSearchChange}
        placeholder="Search..."
        variant="outlined"
        size="small"
        style={{ marginRight: 8 }}
      />
      <Button color="primary" startIcon={<AddIcon />} onClick={handleAddRecord}>
        Add record
      </Button>
      <Button color="secondary" startIcon={<AddIcon />} onClick={addNewColumn}>
        Add column
      </Button>
    </GridToolbarContainer>
  )
})

export default function CustomDataGrid(props: CustomDataGridProps) {
  const { rows: initialRows, columns: initialColumns } = props
  const [rows, setRows] = React.useState(initialRows)
  const [searchText, setSearchText] = React.useState('')
  const [filteredRows, setFilteredRows] = React.useState(initialRows)
  const [columns, setColumns] = React.useState(initialColumns)
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(columns.map((c) => c.field))
  )
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  )

  React.useEffect(() => {
    const lowerSearchText = searchText.toLowerCase()
    const searchRows = rows.filter((row) =>
      columns.some((column) => {
        const value = row[column.field]
        return value !== undefined
          ? value.toString().toLowerCase().includes(lowerSearchText)
          : false
      })
    )
    setFilteredRows(searchRows)
  }, [searchText, rows, columns])

  const addNewColumn = () => {
    const newColumn: GridColDef = {
      field: `newField${columns.length}`,
      headerName: `New Column ${columns.length}`,
      width: 150,
      editable: true,
    }
    setColumns([...columns, newColumn])
    setVisibleColumns(new Set([...visibleColumns, `newField${columns.length}`]))
  }

  const groupedColumns = React.useMemo(() => {
    const grouped = {}
    columns.forEach((column) => {
      const groupName = column.headerName || column.field
      if (!grouped[groupName]) {
        grouped[groupName] = []
      }
      grouped[groupName].push(column.field)
    })
    return grouped
  }, [columns])

  const toggleGroup = (headerName) => {
    setVisibleColumns((prevVisibleColumns) => {
      const newVisibleColumns = new Set(prevVisibleColumns)
      const allVisible = groupedColumns[headerName].every((field) =>
        newVisibleColumns.has(field)
      )
      groupedColumns[headerName].forEach((field) => {
        if (allVisible) {
          newVisibleColumns.delete(field)
        } else {
          newVisibleColumns.add(field)
        }
      })
      return newVisibleColumns
    })
  }

  const filteredColumns = React.useMemo(() => {
    return [
      ...columns
        .filter((column) => visibleColumns.has(column.field))
        .map((column) => ({
          ...column,
          headerName: column.headerName,
        })),
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 150,
        getActions: (params) => {
          const isInEditMode =
            rowModesModel[params.id]?.mode === GridRowModes.Edit
          if (isInEditMode) {
            return [
              <GridActionsCellItem
                key={`${params.id}-save`}
                icon={<SaveIcon />}
                label="Save"
                onClick={() =>
                  setRowModesModel({
                    ...rowModesModel,
                    [params.id]: { mode: GridRowModes.View },
                  })
                }
              />,
              <GridActionsCellItem
                key={`${params.id}-cancel`}
                icon={<CancelIcon />}
                label="Cancel"
                onClick={() => {
                  setRowModesModel({
                    ...rowModesModel,
                    [params.id]: {
                      mode: GridRowModes.View,
                      ignoreModifications: true,
                    },
                  })
                  const editedRow = rows.find((row) => row.id === params.id)
                  if (editedRow && editedRow.isNew) {
                    setRows(rows.filter((row) => row.id !== params.id))
                  }
                }}
              />,
            ]
          }
          return [
            <GridActionsCellItem
              key={`${params.id}-edit`}
              icon={<EditIcon />}
              label="Edit"
              onClick={() =>
                setRowModesModel({
                  ...rowModesModel,
                  [params.id]: { mode: GridRowModes.Edit },
                })
              }
            />,
            <GridActionsCellItem
              key={`${params.id}-delete`}
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() =>
                setRows(rows.filter((row) => row.id !== params.id))
              }
            />,
          ]
        },
      },
    ]
  }, [columns, rowModesModel, rows, visibleColumns])

  function CustomUserItem(props: GridColumnMenuItemProps) {
    const { myCustomHandler, myCustomValue } = props
    return (
      <MenuItem onClick={myCustomHandler}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>{myCustomValue}</ListItemText>
      </MenuItem>
    )
  }
  function CustomColumnMenu(props: GridColumnMenuProps) {
    return (
      <GridColumnMenu
        {...props}
        slots={{
          // Add new item
          columnMenuUserItem: CustomUserItem,
        }}
        slotProps={{
          columnMenuUserItem: {
            // set `displayOrder` for the new item
            displayOrder: 15,
            // Additional props
            myCustomValue: 'Delete Column',
            myCustomHandler: () => handleDeleteColumn(props.colDef.field),
          },
        }}
      />
    )
  }
  function handleDeleteColumn(field) {
    setColumns((prevColumns) =>
      prevColumns.filter((column) => column.field !== field)
    )
    setVisibleColumns(
      (prevVisibleColumns) =>
        new Set([...prevVisibleColumns].filter((f) => f !== field))
    )
  }
  return (
    <>
      <FormGroup row>
        {Object.keys(groupedColumns).map((headerName) => (
          <FormControlLabel
            key={headerName}
            control={
              <Checkbox
                checked={groupedColumns[headerName].every((field) =>
                  visibleColumns.has(field)
                )}
                onChange={() => toggleGroup(headerName)}
                name={headerName}
              />
            }
            label={headerName}
          />
        ))}
      </FormGroup>
      <Grid item>
        <DataGrid
          rows={filteredRows}
          columns={filteredColumns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={setRowModesModel}
          processRowUpdate={(newRow) => {
            const updatedRow = { ...newRow, isNew: false }
            setRows(
              rows.map((row) => (row.id === newRow.id ? updatedRow : row))
            )
            return updatedRow
          }}
          onRowEditStop={(params, event) => {
            if (params.reason === GridRowEditStopReasons.rowFocusOut) {
              event.defaultMuiPrevented = true
            }
          }}
          slots={{
            toolbar: () => (
              <EditToolbar
                setRows={setRows}
                addNewColumn={addNewColumn}
                onSearchChange={setSearchText}
                searchText={searchText}
              />
            ),
            columnMenu: CustomColumnMenu,
          }}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </Grid>
    </>
  )
}

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Modal from 'react-modal';
import { TextField, Button, Grid } from '@mui/material';
import { addDays, subDays, format, startOfWeek, getWeek } from 'date-fns';
import './SetHours.css';

const initialData = {
  employees: [
    { id: 'emp1', name: 'Employee 1', shifts: [] },
    { id: 'emp2', name: 'Employee 2', shifts: [] },
  ],
};

const weekDays = [
  'Maanantai',
  'Tiistai',
  'Keskiviikko',
  'Torstai',
  'Perjantai',
  'Lauantai',
  'Sunnuntai',
];

const SetHours = () => {
  const [data, setData] = useState(initialData);
  const [startDate, setStartDate] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentShift, setCurrentShift] = useState({
    employeeId: null,
    dayIndex: null,
  });
  const [shiftStartHour, setShiftStartHour] = useState('');
  const [shiftStartMinute, setShiftStartMinute] = useState('');
  const [shiftEndHour, setShiftEndHour] = useState('');
  const [shiftEndMinute, setShiftEndMinute] = useState('');
  const [clipboardShift, setClipboardShift] = useState(null);
  const [selectedCells, setSelectedCells] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [isPasting, setIsPasting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('shiftData');
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('shiftData', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    Modal.setAppElement('#root');

    const handleKeyDown = (e) => {
      if (
        e.ctrlKey &&
        e.key === 'c' &&
        currentShift.employeeId !== null &&
        currentShift.dayIndex !== null
      ) {
        handleShiftCopy(currentShift.employeeId, {
          startHour: shiftStartHour,
          startMinute: shiftStartMinute,
          endHour: shiftEndHour,
          endMinute: shiftEndMinute,
          dayIndex: currentShift.dayIndex,
        });
      }

      if (e.ctrlKey && e.key === 'v' && clipboardShift) {
        setIsPasting(true);
        alert('Valitse kohdesolu ja klikkaa liittääksesi työvuoron.');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    currentShift,
    clipboardShift,
    shiftStartHour,
    shiftStartMinute,
    shiftEndHour,
    shiftEndMinute,
  ]);

  useEffect(() => {
    if (
      modalIsOpen &&
      clipboardShift &&
      currentShift.employeeId !== null &&
      currentShift.dayIndex !== null
    ) {
      // Päivitä tilat kun modaali aukeaa
      setShiftStartHour(
        clipboardShift.startHour !== undefined
          ? String(clipboardShift.startHour).padStart(2, '0')
          : ''
      );
      setShiftStartMinute(
        clipboardShift.startMinute !== undefined
          ? String(clipboardShift.startMinute).padStart(2, '0')
          : ''
      );
      setShiftEndHour(
        clipboardShift.endHour !== undefined
          ? String(clipboardShift.endHour).padStart(2, '0')
          : ''
      );
      setShiftEndMinute(
        clipboardShift.endMinute !== undefined
          ? String(clipboardShift.endMinute).padStart(2, '0')
          : ''
      );
    }
  }, [modalIsOpen, clipboardShift, currentShift]);

  const handlePrev = () => {
    setStartDate(subDays(startDate, 21));
  };

  const handleNext = () => {
    setStartDate(addDays(startDate, 21));
  };

  const getDates = (start, days) => {
    return Array.from({ length: days }, (_, i) => addDays(start, i));
  };

  const dates = getDates(startDate, 21);

  const getWeekdayName = (date) => {
    const dayIndex = date.getDay();
    return weekDays[(dayIndex + 6) % 7];
  };

  const onDragEnd = (result) => {
    setIsDragging(false);
    const { destination, source } = result;
    if (!destination) return;

    const [sourceEmployeeId, sourceDayIndex] = source.droppableId.split('-');
    const [destinationEmployeeId, destinationDayIndex] =
      destination.droppableId.split('-');

    if (
      sourceEmployeeId === destinationEmployeeId &&
      sourceDayIndex === destinationDayIndex
    )
      return;

    const sourceEmployee = data.employees.find(
      (emp) => emp.id === sourceEmployeeId
    );
    const destinationEmployee = data.employees.find(
      (emp) => emp.id === destinationEmployeeId
    );

    const sourceShiftIndex = sourceEmployee.shifts.findIndex(
      (shift) => shift.dayIndex === parseInt(sourceDayIndex)
    );
    const destinationShiftIndex = destinationEmployee.shifts.findIndex(
      (shift) => shift.dayIndex === parseInt(destinationDayIndex)
    );

    if (sourceShiftIndex === -1) return;

    // Kopioidaan siirrettävä vuoro
    const draggedShift = sourceEmployee.shifts[sourceShiftIndex];

    let updatedSourceShifts = sourceEmployee.shifts.filter(
      (shift) => shift.dayIndex !== parseInt(sourceDayIndex)
    );

    if (destinationShiftIndex !== -1) {
      // Jos kohteessa on jo vuoro, vaihdetaan ne paikat
      const targetShift = destinationEmployee.shifts[destinationShiftIndex];

      updatedSourceShifts.push({
        ...targetShift,
        dayIndex: parseInt(sourceDayIndex),
      });

      const updatedDestinationShifts = destinationEmployee.shifts.filter(
        (shift) => shift.dayIndex !== parseInt(destinationDayIndex)
      );

      updatedDestinationShifts.push({
        ...draggedShift,
        dayIndex: parseInt(destinationDayIndex),
      });

      const updatedEmployees = data.employees.map((emp) => {
        if (emp.id === sourceEmployeeId) {
          return { ...emp, shifts: updatedSourceShifts };
        }
        if (emp.id === destinationEmployeeId) {
          return { ...emp, shifts: updatedDestinationShifts };
        }
        return emp;
      });

      setData({ ...data, employees: updatedEmployees });
    } else {
      // Jos kohteessa ei ole vuoroa, siirretään se
      const updatedDestinationShifts = destinationEmployee.shifts.slice();
      updatedDestinationShifts.push({
        ...draggedShift,
        dayIndex: parseInt(destinationDayIndex),
      });

      const updatedEmployees = data.employees.map((emp) => {
        if (emp.id === sourceEmployeeId) {
          return { ...emp, shifts: updatedSourceShifts };
        }
        if (emp.id === destinationEmployeeId) {
          return { ...emp, shifts: updatedDestinationShifts };
        }
        return emp;
      });

      setData({ ...data, employees: updatedEmployees });
    }
  };

  const handleShiftSubmit = () => {
    const formattedStartHour = shiftStartHour.padStart(2, '0') || '00';
    const formattedStartMinute = shiftStartMinute.padStart(2, '0') || '00';
    const formattedEndHour = shiftEndHour.padStart(2, '0') || '00';
    const formattedEndMinute = shiftEndMinute.padStart(2, '0') || '00';

    if (
      formattedStartHour === '00' &&
      formattedStartMinute === '00' &&
      formattedEndHour === '00' &&
      formattedEndMinute === '00'
    ) {
      alert('Täytä kaikki kentät.');
      return;
    }

    const newShift = {
      startHour: parseInt(formattedStartHour),
      startMinute: parseInt(formattedStartMinute),
      endHour: parseInt(formattedEndHour),
      endMinute: parseInt(formattedEndMinute),
      dayIndex: currentShift.dayIndex, // Lisää dayIndex uuteen shift-objektiin
    };

    // Päivitä kaikki valitut solut
    const updatedEmployees = data.employees.map((emp) => {
      if (selectedCells.some((cell) => cell.employeeId === emp.id)) {
        const updatedShifts = emp.shifts.filter(
          (shift) =>
            !selectedCells.some(
              (cell) =>
                cell.employeeId === emp.id && cell.dayIndex === shift.dayIndex
            )
        );

        selectedCells.forEach((cell) => {
          if (cell.employeeId === emp.id) {
            updatedShifts.push({ ...newShift, dayIndex: cell.dayIndex });
          }
        });

        return { ...emp, shifts: updatedShifts };
      }
      return emp;
    });

    setData({ ...data, employees: updatedEmployees });
    closeModal();
  };

  const handlePasteShift = (employeeId, dayIndex) => {
    if (clipboardShift) {
      setCurrentShift({
        employeeId,
        dayIndex,
      });
      // Päivitä suoraan tiloja
      setShiftStartHour(
        clipboardShift.startHour !== undefined
          ? String(clipboardShift.startHour).padStart(2, '0')
          : ''
      );
      setShiftStartMinute(
        clipboardShift.startMinute !== undefined
          ? String(clipboardShift.startMinute).padStart(2, '0')
          : ''
      );
      setShiftEndHour(
        clipboardShift.endHour !== undefined
          ? String(clipboardShift.endHour).padStart(2, '0')
          : ''
      );
      setShiftEndMinute(
        clipboardShift.endMinute !== undefined
          ? String(clipboardShift.endMinute).padStart(2, '0')
          : ''
      );
      setModalIsOpen(true);
      setIsPasting(false);
      console.log('Pasting shift:', clipboardShift); // Logaa liitettävä vuoro
    } else {
      alert('Leikepöydällä ei ole kelvollista vuoroa liitettäväksi.');
    }
  };

  const handleShiftDeleteMultiple = () => {
    const employeeId = currentShift.employeeId;
    const newShifts = data.employees.map((emp) => {
      if (emp.id === employeeId) {
        const updatedShifts = emp.shifts.filter(
          (shift) =>
            !selectedCells.some(
              (cell) =>
                cell.dayIndex === shift.dayIndex &&
                cell.employeeId === employeeId
            )
        );
        return { ...emp, shifts: updatedShifts };
      }
      return emp;
    });
    setData({ ...data, employees: newShifts });
    setModalIsOpen(false);
    setSelectedCells([]);
    setIsSelecting(false);
    setSelectedEmployeeId(null);
    setIsPasting(false);
  };

  const handleShiftDelete = (e, employeeId, dayIndex) => {
    e.stopPropagation();
    const newShifts = data.employees.map((emp) => {
      if (emp.id === employeeId) {
        const updatedShifts = emp.shifts.filter(
          (shift) => shift.dayIndex !== dayIndex
        );
        return { ...emp, shifts: updatedShifts };
      }
      return emp;
    });
    setData({ ...data, employees: newShifts });
  };

  const handleShiftCopy = (employeeId, shift) => {
    if (
      shift &&
      shift.startHour !== undefined &&
      shift.startMinute !== undefined &&
      shift.endHour !== undefined &&
      shift.endMinute !== undefined
    ) {
      setClipboardShift({
        startHour: shift.startHour,
        startMinute: shift.startMinute,
        endHour: shift.endHour,
        endMinute: shift.endMinute,
        employeeId,
        dayIndex: shift.dayIndex,
      });
      alert('Työvuoro kopioitu.');
      console.log('Copied shift:', shift); // Logaa kopioitu vuoro
    } else {
      alert('Työvuoro on tyhjä, ei voida kopioida.');
    }
  };

  const getEmployeeName = (employeeId) => {
    const employee = data.employees.find((emp) => emp.id === employeeId);
    return employee ? employee.name : '';
  };

  const handleMouseDown = (employeeId, dayIndex, e) => {
    const hasShift = data.employees
      .find((emp) => emp.id === employeeId)
      .shifts.some((shift) => shift.dayIndex === dayIndex);

    if (hasShift) {
      // Jos solussa on vuoro, estetään kaikki muut toiminnot paitsi raahaaminen
      return;
    }

    // Jos solussa ei ole vuoroa, jatka normaalisti
    setIsSelecting(true);
    setSelectedCells([{ employeeId, dayIndex }]);
    setSelectedEmployeeId(employeeId);
  };

  const handleMouseOver = (employeeId, dayIndex) => {
    if (isSelecting && employeeId === selectedEmployeeId) {
      setSelectedCells((prev) => {
        const exists = prev.some(
          (cell) => cell.employeeId === employeeId && cell.dayIndex === dayIndex
        );
        if (!exists) {
          return [...prev, { employeeId, dayIndex }];
        }
        return prev;
      });
    }
  };

  const handleMouseUp = (e) => {
    if (e.target.tagName === 'BUTTON') {
      return;
    }

    if (selectedCells.length > 0) {
      const firstCell = selectedCells[0];
      const allSameEmployee = selectedCells.every(
        (cell) => cell.employeeId === firstCell.employeeId
      );
      if (allSameEmployee) {
        setCurrentShift({
          employeeId: firstCell.employeeId,
          dayIndex: firstCell.dayIndex,
        });
        setModalIsOpen(true);
      } else {
        // Aseta tyhjä työntekijä-ID ja ensimmäinen valittu päivä muokkausmoodiin
        setCurrentShift({
          employeeId: null,
          dayIndex: firstCell.dayIndex,
        });
        setModalIsOpen(true);
      }
    }
    setIsSelecting(false);
    setSelectedEmployeeId(null);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setShiftStartHour('');
    setShiftStartMinute('');
    setShiftEndHour('');
    setShiftEndMinute('');
    setClipboardShift(null);
    setIsPasting(false);
  };

  return (
    <div className="set-hours-container" onMouseUp={handleMouseUp}>
      <div className="calendar-navigation">
        <button onClick={handlePrev}>Previous</button>
        <button onClick={handleNext}>Next</button>
      </div>
      <DragDropContext
        onDragEnd={onDragEnd}
        onDragStart={() => setIsDragging(true)}
      >
        <div className="calendar-grid">
          <div className="calendar-header">
            <div className="calendar-row" id="weeks">
              <div className="calendar-cell empty-cell"></div>
              {Array.from({ length: 3 }, (_, weekIndex) => (
                <div
                  className="calendar-cell week-number"
                  key={weekIndex}
                  colSpan={7}
                >
                  Viikko {getWeek(addDays(startDate, weekIndex * 7))}
                </div>
              ))}
            </div>
            <div className="calendar-row">
              <div className="calendar-cell empty-cell"></div>
              {dates.map((date, index) => (
                <React.Fragment key={date}>
                  <div className="calendar-cell date-cell">
                    <div>{getWeekdayName(date)}</div>
                    <div>{format(date, 'dd.MM.yyyy')}</div>
                  </div>
                  {index % 7 === 7 && (
                    <>
                      <div className="week-separator"></div>
                      <div className="calendar-cell date-cell-separator"></div>
                    </>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="calendar-body">
            {data.employees.map((employee) => (
              <div key={employee.id} className="calendar-row">
                <div className="calendar-cell employee-cell">
                  {employee.name}
                </div>
                {dates.map((date, index) => (
                  <React.Fragment key={index}>
                    <Droppable
                      key={`${employee.id}-${index}`}
                      droppableId={`${employee.id}-${index}`}
                      direction="horizontal"
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`calendar-cell ${
                            selectedCells.find(
                              (cell) =>
                                cell.employeeId === employee.id &&
                                cell.dayIndex === index
                            )
                              ? 'selected'
                              : ''
                          } ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
                          onMouseDown={(e) =>
                            handleMouseDown(employee.id, index, e)
                          }
                          onMouseOver={(e) => {
                            if (
                              isSelecting &&
                              e.buttons === 1 &&
                              !employee.shifts.find(
                                (shift) => shift.dayIndex === index
                              )
                            ) {
                              handleMouseOver(employee.id, index);
                            }
                          }}
                          onClick={() => {
                            if (isPasting) {
                              handlePasteShift(employee.id, index);
                            } else {
                              setCurrentShift({
                                employeeId: employee.id,
                                dayIndex: index,
                              });
                              setModalIsOpen(true);
                            }
                          }}
                        >
                          {employee.shifts
                            .filter((shift) => shift.dayIndex === index)
                            .map((shift, idx) => (
                              <Draggable
                                key={`${employee.id}-${index}-${shift.dayIndex}`}
                                draggableId={`${employee.id}-${index}-${shift.dayIndex}`}
                                index={idx}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="draggable-cell"
                                  >
                                    <div className="shift">
                                      <button
                                        className="delete-btn"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleShiftDelete(
                                            e,
                                            employee.id,
                                            shift.dayIndex
                                          );
                                        }}
                                      >
                                        ✖
                                      </button>
                                      <span className="shift-time">{`${String(
                                        shift.startHour
                                      ).padStart(2, '0')}:${String(
                                        shift.startMinute
                                      ).padStart(2, '0')} - ${String(
                                        shift.endHour
                                      ).padStart(2, '0')}:${String(
                                        shift.endMinute
                                      ).padStart(2, '0')}`}</span>
                                      <button
                                        className="copy-btn"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleShiftCopy(employee.id, shift);
                                        }}
                                      >
                                        Kopioi
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                    {index % 7 === 6 && <div className="week-separator"></div>}
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </div>
      </DragDropContext>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Set Shift Time"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>
          {selectedCells.length > 1
            ? 'Aseta useita vuoroja'
            : clipboardShift
            ? 'Liitä työvuoro'
            : 'Aseta työvuoro'}
        </h2>
        <p>
          Työntekijä:{' '}
          {currentShift.employeeId
            ? getEmployeeName(currentShift.employeeId)
            : 'Useita'}
        </p>
        <p>
          Päivämäärä:{' '}
          {selectedCells.length > 1
            ? 'Useita päiviä'
            : format(addDays(startDate, currentShift.dayIndex), 'dd.MM.yyyy')}
        </p>
        <div className="time-selectors">
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Aloitustunti"
                type="number"
                value={shiftStartHour || '00'} // Varmistaa oletusarvon
                onChange={(e) => setShiftStartHour(e.target.value)}
                inputProps={{ min: '0', max: '23', step: '1' }}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Aloitusminuutti"
                type="number"
                value={shiftStartMinute || '00'} // Varmistaa oletusarvon
                onChange={(e) => setShiftStartMinute(e.target.value)}
                inputProps={{ min: '0', max: '59', step: '1' }}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Lopetustunti"
                type="number"
                value={shiftEndHour || '00'} // Varmistaa oletusarvon
                onChange={(e) => setShiftEndHour(e.target.value)}
                inputProps={{ min: '0', max: '23', step: '1' }}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Lopetusminuutti"
                type="number"
                value={shiftEndMinute || '00'} // Varmistaa oletusarvon
                onChange={(e) => setShiftEndMinute(e.target.value)}
                inputProps={{ min: '0', max: '59', step: '1' }}
                fullWidth
              />
            </Grid>
          </Grid>
        </div>
        <div className="modal-buttons">
          <Button
            variant="contained"
            color="primary"
            onClick={handleShiftSubmit}
          >
            {selectedCells.length > 1
              ? 'Aseta useita'
              : clipboardShift
              ? 'Liitä'
              : 'Aseta'}
          </Button>
          <Button variant="outlined" color="secondary" onClick={closeModal}>
            Peruuta
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleShiftDeleteMultiple}
            className="delete-multiple-btn"
          >
            Poista
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default SetHours;


import { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { TbTextWrap } from "react-icons/tb";
import { useTransactionStore } from "../store/useTransactionStore";
import { IoIosTrendingUp } from "react-icons/io";
import { IoTrendingDown } from "react-icons/io5";

import { Calendar, Event as BigCalendarEvent, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { localizer } from "../utils/localizer";

import '../styles/Tranfer.css';
import { useCardStore } from "../store/useCardStore";

const messagesES = {
    today: 'Hoy',
    previous: 'Anterior',
    next: 'Siguiente',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'No hay eventos en este rango.',
};

type MyEvent = BigCalendarEvent & { color?: string };

export const Transfer = () => {
    const { transactions, fetchTransactions } = useTransactionStore();
    const { cardDetails } = useCardStore();

    const [calendarEvents, setCalendarEvents] = useState<MyEvent[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [selectedEvent, setSelectedEvent] = useState<MyEvent | null>(null);

    const accountKey = cardDetails?.accountNumber ? `events-${cardDetails.accountNumber}` : null;

    const handleDeleteEvent = () => {
        if (!accountKey || !selectedEvent) return;

        const userEventsOnly = calendarEvents.filter(event => {
            const titleString = String(event.title);
            return !titleString.startsWith("Ingreso") && !titleString.startsWith("Egreso");
        });

        const updatedEvents = userEventsOnly.filter(event => event !== selectedEvent);

        localStorage.setItem(accountKey, JSON.stringify(updatedEvents));

        setCalendarEvents(calendarEvents.filter(event => event !== selectedEvent));

        setSelectedEvent(null);
    };

    const handleChangeEventColor = (color: string) => {
        if (!accountKey || !selectedEvent) return;

        const updatedEvent = { ...selectedEvent, color };

        const userEventsOnly = calendarEvents.filter(event => {
            const titleString = String(event.title);
            return !titleString.startsWith("Ingreso") && !titleString.startsWith("Egreso");
        });

        const updatedEvents = userEventsOnly.map(event =>
            event === selectedEvent ? updatedEvent : event
        );

        localStorage.setItem(accountKey, JSON.stringify(updatedEvents));

        setCalendarEvents(calendarEvents.map(event =>
            event === selectedEvent ? updatedEvent : event
        ));

        setSelectedEvent(updatedEvent);
    };

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    useEffect(() => {
        if (!accountKey) return;

        const txEvents: MyEvent[] = transactions.map(tx => ({
            title: `${tx.type === "RECEIVER" ? 'Ingreso' : 'Egreso'} - $${tx.amount.toFixed(2)}`,
            start: new Date(tx.date),
            end: new Date(tx.date),
            allDay: false,
        }));

        const storedEvents = localStorage.getItem(accountKey);
        if (storedEvents) {
            const parsedEvents = JSON.parse(storedEvents).map((event: any) => ({
                ...event,
                start: new Date(event.start),
                end: new Date(event.end),
            }));
            setCalendarEvents([...txEvents, ...parsedEvents]);
        } else {
            setCalendarEvents(txEvents);
        }
    }, [transactions, accountKey]);

    const handleAddEvent = (e: React.FormEvent) => {
        e.preventDefault();

        if (!accountKey) return;

        const newEvent: MyEvent = {
            title: newTitle,
            start: selectedSlot.start,
            end: selectedSlot.end,
            allDay: false,
            color: "#3b82f6"
        };

        const userEventsOnly = calendarEvents.filter(event => {
            const titleString = String(event.title);
            return !titleString.startsWith("Ingreso") && !titleString.startsWith("Egreso");
        });

        const updatedEvents = [...userEventsOnly, newEvent];
        localStorage.setItem(accountKey, JSON.stringify(updatedEvents));

        setCalendarEvents([...calendarEvents, newEvent]);
        setShowModal(false);
        setNewTitle('');
    };


    const ingresosCount = calendarEvents.filter(event =>
        String(event.title).startsWith("Ingreso")
    ).length;

    const egresosCount = calendarEvents.filter(event =>
        String(event.title).startsWith("Egreso")
    ).length;

    const personalesCount = calendarEvents.filter(event =>
        !String(event.title).startsWith("Ingreso") &&
        !String(event.title).startsWith("Egreso")
    ).length;


    return (
        <>
            <div className="tr-con">
                <Fade className='history-layout' direction='down' triggerOnce={true}>
                    <div className='card-history'>
                        <div className='history-text'>
                            <TbTextWrap className='h-i' />
                            <p className='h-p'>Transacciones de la cuenta</p>
                        </div>

                        {transactions
                            .slice()
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .slice(0, 5)
                            .map(tx => (
                                <div key={tx.id} className='history-text'>
                                    {tx.type === "RECEIVER" ? (
                                        <IoIosTrendingUp className='bg-green-500 text-white rounded-full tr' />
                                    ) : (
                                        <IoTrendingDown className='bg-red-500 text-white rounded-full tr' />
                                    )}
                                    <div className='flex justify-between items-center w-full'>
                                        <div>
                                            <p className='text-sm text-gray-500'>De: {tx.name}</p>
                                            <p className='h-p'>{tx.description ?? tx.accountNumber}</p>
                                            <p className='text-sm text-gray-500'>Cuenta {tx.accountNumber}</p>
                                            <p className='text-sm text-gray-400'>
                                                {new Date(tx.date).toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className={tx.type === "RECEIVER" ? '' : 'text-red-500'}>
                                                {tx.type === "RECEIVER" ? `$${tx.amount.toFixed(2)}` : `-$${tx.amount.toFixed(2)}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </Fade>

                <div className="contadores">
                    <div className="contadores grid grid-cols-3 gap-4 mt-4">
                        <div className="bg-green-100 text-green-800 p-4 cont-dv rounded shadow text-center">
                            <p className="text-lg font-semibold">Ingresos</p>
                            <p className="text-3xl">{ingresosCount}</p>
                        </div>
                        <div className="bg-red-100 text-red-800 p-4 cont-dv rounded shadow text-center">
                            <p className="text-lg font-semibold">Egresos</p>
                            <p className="text-3xl">{egresosCount}</p>
                        </div>
                        <div className="bg-blue-100 text-blue-800 p-4 cont-dv rounded shadow text-center">
                            <p className="text-lg font-semibold">Personales</p>
                            <p className="text-3xl">{personalesCount}</p>
                        </div>
                    </div>

                </div>
            </div>

            <div className="reminders-section">
                <div className="calendar p-4">
                    <Calendar
                        localizer={localizer}
                        events={calendarEvents}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                        defaultView={Views.MONTH}
                        messages={messagesES}
                        selectable
                        onSelectSlot={(slotInfo) => {
                            setSelectedSlot(slotInfo);
                            setShowModal(true);
                        }}
                        onSelectEvent={(event) => setSelectedEvent(event as MyEvent)}
                        eventPropGetter={(event) => {
                            const backgroundColor = (event as MyEvent).color
                                ? (event as MyEvent).color
                                : event.title?.toString().startsWith("Ingreso")
                                    ? "#34d399"
                                    : event.title?.toString().startsWith("Egreso")
                                        ? "#f87171"
                                        : "#3b82f6";

                            return {
                                style: {
                                    backgroundColor
                                }
                            };
                        }}
                    />
                </div>

                <div className="details p-4">
                    <div className="panel-agenda bg-white border rounded p-4 shadow-md mt-4 min-h-[300px] flex flex-col justify-between">
                        {selectedEvent ? (
                            <>
                                <h3 className="text-lg font-semibold mb-2 pn-h">Evento</h3>
                                <input
                                    type="text"
                                    value={String(selectedEvent.title)}
                                    onChange={(e) => {
                                        const updatedEvent = { ...selectedEvent, title: e.target.value };
                                        setSelectedEvent(updatedEvent);
                                    }}
                                    className="w-full border p-2 rounded mb-2 chang-ev"
                                />
                                <p className="text-gray-500 text-sm mb-1 pn-t">
                                    Realizado: {selectedEvent.start ? new Date(selectedEvent.start).toLocaleString() : ''}
                                </p>
                                <p className="text-gray-500 text-sm mb-3 pn-t">
                                    Para: {selectedEvent.end ? new Date(selectedEvent.end).toLocaleString() : ''}
                                </p>
                                <div className="flex items-center mb-3 space-x-2">
                                    <span className="text-sm">Color:</span>
                                    {["#3b82f6", "#34d399", "#f87171", "#facc15", "#a78bfa"].map(color => (
                                        <div
                                            key={color}
                                            className="w-10 h-10 rounded-full cursor-pointer border"
                                            style={{ backgroundColor: color }}
                                            onClick={() => handleChangeEventColor(color)}
                                        ></div>
                                    ))}
                                </div>
                                <div className="flex justify-between space-x-2">
                                    <button
                                        className="btn-pan w-1/2 px-4 py-2 bg-red-500 text-white rounded"
                                        onClick={handleDeleteEvent}
                                    >
                                        Eliminar
                                    </button>
                                    <button
                                        className="btn-pan w-1/2 px-4 py-2 bg-gray-900 text-white rounded"
                                        onClick={() => setSelectedEvent(null)}
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col justify-center items-center text-center text-gray-500 h-full">
                                <p className="text-lg font-semibold mb-2">Agenda</p>
                                <p className="text-sm">Seleccione un evento o cree uno nuevo para editarlo aquí.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {showModal && (
                <div className="modal-agenda modal-overlay fixed inset-0 flex justify-center items-center z-50">
                    <Fade direction="down" triggerOnce={true}>
                        <div className="modal-content bg-white p-6 rounded shadow-md w-full max-w-md">
                            <h2 className="text-xl mb-4 ag-h">Nuevo Evento</h2>
                            <form onSubmit={handleAddEvent} className="space-y-4">
                                <div>
                                    <label className="block mb-5 text-sm ag-ti">Título:</label>
                                    <input
                                        type="text"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        className="w-full border p-7 rounded ag-in"
                                        required
                                        placeholder="Agregue un nuevo evento a su agenda..."
                                    />
                                </div>
                                <div className="flex justify-between space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 w-1/2 bg-gray-900 text-white rounded btn-can"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 w-1/2 py-2 bg-green-500 text-white rounded btn-ag"
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Fade>
                </div>
            )}
        </>
    );
};

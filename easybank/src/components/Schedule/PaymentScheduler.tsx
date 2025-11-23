import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, X, Plus } from "lucide-react"
import "./style/payment-scheduler.css"
import { useEasyBankStore } from "../../store/userStore"

interface ScheduledPayment {
    id: string
    fecha: string
    fechaFin: string
    nombre: string
    monto: number
    color: string
    categoria: string
}

const colorOptions = [
    { name: "red", bg: "#fee2e2", text: "#b91c1c", border: "#fca5a5" },
    { name: "blue", bg: "#dbeafe", text: "#1e40af", border: "#93c5fd" },
    { name: "green", bg: "#dcfce7", text: "#15803d", border: "#86efac" },
    { name: "purple", bg: "#f3e8ff", text: "#6b21a8", border: "#e9d5ff" },
    { name: "yellow", bg: "#fef3c7", text: "#b45309", border: "#fcd34d" },
    { name: "pink", bg: "#fce7f3", text: "#be185d", border: "#fbcfe8" },
]

const categorias = ["Servicios", "Deudas", "Suscripciones", "Inversión", "Otro"]

export function PaymentScheduler() {

    const token = useEasyBankStore((state) => state.token);

    const [mes, setMes] = useState(new Date(2024, 10))
    const [pagos, setPagos] = useState<ScheduledPayment[]>([])
    const [pagoSeleccionado, setPagoSeleccionado] = useState<ScheduledPayment | null>(null)
    const [formularioAbierto, setFormularioAbierto] = useState(false)
    const [formData, setFormData] = useState({
        nombre: "",
        monto: "",
        fechaInicio: "",
        fechaFin: "",
        color: "blue",
        categoria: "Otro",
    })

    const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

    const handleMesAnterior = () => setMes(new Date(mes.getFullYear(), mes.getMonth() - 1))
    const handleMesSiguiente = () => setMes(new Date(mes.getFullYear(), mes.getMonth() + 1))

    const handleAgregarPago = () => {
        if (formData.nombre && formData.monto && formData.fechaInicio) {
            const nuevoPago: ScheduledPayment = {
                id: Date.now().toString(),
                fecha: formData.fechaInicio,
                fechaFin: formData.fechaFin || formData.fechaInicio,
                nombre: formData.nombre,
                monto: Number.parseFloat(formData.monto),
                color: formData.color,
                categoria: formData.categoria,
            }
            setPagos([...pagos, nuevoPago])
            resetFormulario()
        }
    }

    const handleActualizarPago = () => {
        if (pagoSeleccionado && formData.nombre && formData.monto) {
            setPagos(
                pagos.map((p) =>
                    p.id === pagoSeleccionado.id
                        ? {
                            ...p,
                            nombre: formData.nombre,
                            monto: Number.parseFloat(formData.monto),
                            fecha: formData.fechaInicio,
                            fechaFin: formData.fechaFin || formData.fechaInicio,
                            color: formData.color,
                            categoria: formData.categoria,
                        }
                        : p,
                ),
            )
            resetFormulario()
        }
    }

    const handleEliminarPago = () => {
        if (pagoSeleccionado) {
            setPagos(pagos.filter((p) => p.id !== pagoSeleccionado.id))
            resetFormulario()
        }
    }

    const resetFormulario = () => {
        setFormData({
            nombre: "",
            monto: "",
            fechaInicio: "",
            fechaFin: "",
            color: "blue",
            categoria: "Otro",
        })
        setPagoSeleccionado(null)
        setFormularioAbierto(false)
    }

    const handleEditarPago = (pago: ScheduledPayment) => {
        setPagoSeleccionado(pago)
        setFormData({
            nombre: pago.nombre,
            monto: pago.monto.toString(),
            fechaInicio: pago.fecha,
            fechaFin: pago.fechaFin,
            color: pago.color,
            categoria: pago.categoria,
        })
        setFormularioAbierto(true)
    }

    const getPagosDelDia = (dia: number) => {
        const fechaStr = `2024-${String(mes.getMonth() + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`
        return pagos.filter((p) => p.fecha === fechaStr)
    }

    const renderCalendario = () => {
        const dias = []
        const diasDelMes = getDaysInMonth(mes)
        const primerDia = getFirstDayOfMonth(mes)

        for (let i = 0; i < primerDia; i++) {
            dias.push(<div key={`empty-${i}`} className="calendar-empty-cell"></div>)
        }

        for (let dia = 1; dia <= diasDelMes; dia++) {
            const pagosDelDia = getPagosDelDia(dia)
            const esHoy =
                dia === new Date().getDate() &&
                mes.getMonth() === new Date().getMonth() &&
                mes.getFullYear() === new Date().getFullYear()

            dias.push(
                <div
                    key={dia}
                    className={`calendar-day ${esHoy ? "calendar-day-today" : ""}`}
                    onClick={() => {
                        setFormData({
                            ...formData,
                            fechaInicio: `2024-${String(mes.getMonth() + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`,
                        })
                        setFormularioAbierto(true)
                    }}
                >
                    <div className={`calendar-day-number ${esHoy ? "calendar-day-number-today" : ""}`}>{dia}</div>
                    <div className="calendar-day-payments">
                        {pagosDelDia.slice(0, 2).map((pago) => {
                            const color = colorOptions.find((c) => c.name === pago.color)
                            return (
                                <div
                                    key={pago.id}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleEditarPago(pago)
                                    }}
                                    className="payment-badge"
                                    style={{
                                        backgroundColor: color?.bg,
                                        color: color?.text,
                                    }}
                                >
                                    {pago.nombre}
                                </div>
                            )
                        })}
                        {pagosDelDia.length > 2 && <div className="calendar-more-payments">+{pagosDelDia.length - 2} más</div>}
                    </div>
                </div>,
            )
        }

        return dias
    }

    const totalMesSiguiente = pagos
        .filter((p) => {
            const fecha = new Date(p.fecha)
            return fecha.getMonth() === mes.getMonth() && fecha.getFullYear() === mes.getFullYear()
        })
        .reduce((sum, p) => sum + p.monto, 0)

    useEffect(() => {
        if (!token) return;

        const saved = localStorage.getItem(`pagos_${token}`);
        if (saved) {
            try {
                setPagos(JSON.parse(saved));
            } catch (e) {
                console.error("Error al parsear pagos del localStorage", e);
                setPagos([]);
            }
        }
    }, [token]);


    useEffect(() => {
        if (!token) return;
        localStorage.setItem(`pagos_${token}`, JSON.stringify(pagos));
    }, [pagos, token]);

    return (
        <>
            <div className="mb-12 mt-10">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Mis Finanzas</h1>
                <p className="text-gray-600">Gestiona tus transacciones y agenda tus pagos futuros</p>
            </div>
            <div className="payment-scheduler-container">
                <div className="payment-scheduler-calendar-section">
                    <div className="payment-scheduler-card">
                        <div className="payment-scheduler-header">
                            <h2 className="payment-scheduler-title">Calendario de Pagos</h2>
                            <div className="payment-scheduler-controls">
                                <button onClick={handleMesAnterior} className="payment-scheduler-button-nav" aria-label="Mes anterior">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="payment-scheduler-month">
                                    {mes.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
                                </span>
                                <button onClick={handleMesSiguiente} className="payment-scheduler-button-nav" aria-label="Mes siguiente">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="calendar-weekdays">
                            {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sab"].map((dia) => (
                                <div key={dia} className="calendar-weekday">
                                    {dia}
                                </div>
                            ))}
                        </div>

                        <div className="calendar-grid">{renderCalendario()}</div>

                        <div className="payment-scheduler-total">
                            <p className="payment-scheduler-total-label">Total de pagos programados este mes:</p>
                            <p className="payment-scheduler-total-amount">
                                {new Intl.NumberFormat("es-ES", { style: "currency", currency: "USD" }).format(totalMesSiguiente)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="payment-scheduler-form-section">
                    <div className="payment-scheduler-card payment-scheduler-form-card">
                        <div className="payment-scheduler-form-header">
                            <h3 className="payment-scheduler-form-title">{pagoSeleccionado ? "Editar Pago" : "Nuevo Pago"}</h3>
                            {formularioAbierto && (
                                <button onClick={resetFormulario} className="payment-scheduler-close-button">
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {!formularioAbierto ? (
                            <button onClick={() => setFormularioAbierto(true)} className="payment-scheduler-button-primary">
                                <Plus className="w-5 h-5" />
                                Agendar Pago
                            </button>
                        ) : (
                            <div className="payment-scheduler-form">
                                <div className="form-group">
                                    <label className="form-label">Nombre del Pago</label>
                                    <input
                                        type="text"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                        className="form-input"
                                        placeholder="Ej: Pago Hipoteca"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Monto (USD)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.monto}
                                        onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                                        className="form-input"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Categoría</label>
                                    <select
                                        value={formData.categoria}
                                        onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                                        className="form-input"
                                    >
                                        {categorias.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Fecha Inicio</label>
                                    <input
                                        type="date"
                                        value={formData.fechaInicio}
                                        onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Fecha Fin (opcional)</label>
                                    <input
                                        type="date"
                                        value={formData.fechaFin}
                                        onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Color de Etiqueta</label>
                                    <div className="color-picker">
                                        {colorOptions.map((color) => (
                                            <button
                                                key={color.name}
                                                onClick={() => setFormData({ ...formData, color: color.name })}
                                                className={`color-option ${formData.color === color.name ? "color-option-selected" : ""}`}
                                                style={{
                                                    backgroundColor: color.bg,
                                                    borderColor: formData.color === color.name ? "#1f2937" : "#d1d5db",
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="form-buttons">
                                    {pagoSeleccionado ? (
                                        <>
                                            <button onClick={handleActualizarPago} className="button-update">
                                                Actualizar
                                            </button>
                                            <button onClick={handleEliminarPago} className="button-delete">
                                                Eliminar
                                            </button>
                                        </>
                                    ) : (
                                        <button onClick={handleAgregarPago} className="button-add">
                                            Agregar Pago
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {pagos.length > 0 && (
                            <div className="payment-list">
                                <h4 className="payment-list-title">Próximos Pagos</h4>
                                <div className="payment-list-items">
                                    {pagos.map((pago) => {
                                        const color = colorOptions.find((c) => c.name === pago.color)
                                        return (
                                            <div
                                                key={pago.id}
                                                onClick={() => handleEditarPago(pago)}
                                                className="payment-list-item"
                                                style={{
                                                    backgroundColor: color?.bg,
                                                    color: color?.text,
                                                    borderLeftColor: color?.border,
                                                }}
                                            >
                                                <p className="payment-list-item-name">{pago.nombre}</p>
                                                <p className="payment-list-item-date">{new Date(pago.fecha).toLocaleDateString("es-ES")}</p>
                                                <p className="payment-list-item-amount">
                                                    {new Intl.NumberFormat("es-ES", { style: "currency", currency: "USD" }).format(pago.monto)}
                                                </p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
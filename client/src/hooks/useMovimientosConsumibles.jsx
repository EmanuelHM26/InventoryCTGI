// hooks/useMovimientosConsumibles.jsx
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export const useMovimientosConsumibles = (actualizarProductoLocal) => {
  const [showModalMovimiento, setShowModalMovimiento] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [tipoMovimiento, setTipoMovimiento] = useState("salida");
  const [cantidadMovimiento, setCantidadMovimiento] = useState("");
  const [motivoMovimiento, setMotivoMovimiento] = useState("");

  const realizarMovimiento = async (producto, tipo, cantidad, motivo) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/movimientosconsumibles",
        {
          IdProductoConsumible: producto.IdProductosConsumibles,
          TipoMovimiento: tipo,
          Cantidad: parseInt(cantidad),
          Motivo: motivo,
        },
        { withCredentials: true }
      );

      // ACTUALIZAR ESTADO LOCAL INMEDIATAMENTE
      if (
        actualizarProductoLocal &&
        response.data.nuevaCantidad !== undefined
      ) {
        actualizarProductoLocal(producto.IdProductosConsumibles, {
          CantidadDisponible: response.data.nuevaCantidad,
        });
      }

      Swal.fire({
        icon: "success",
        title: "Movimiento registrado",
        text: `Se ${
          tipo === "entrada" ? "agregaron" : "retiraron"
        } ${cantidad} unidades de ${producto.Nombre}`,
        timer: 2000,
        showConfirmButton: false,
      });

      return true;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Error al registrar movimiento",
        showConfirmButton: true,
      });
      return false;
    }
  };

  const abrirModalMovimiento = (producto, tipo = "salida") => {
    setProductoSeleccionado(producto);
    setTipoMovimiento(tipo);
    setCantidadMovimiento("");
    setMotivoMovimiento("");
    setShowModalMovimiento(true);
  };

  return {
    showModalMovimiento,
    setShowModalMovimiento,
    productoSeleccionado,
    tipoMovimiento,
    setTipoMovimiento,
    cantidadMovimiento,
    setCantidadMovimiento,
    motivoMovimiento,
    setMotivoMovimiento,
    realizarMovimiento,
    abrirModalMovimiento,
  };
};

interface Province {
  id: string
  nombre: string
  nombre_completo: string
  fuente: string
  categoria: string
  centroide: Centroide
  iso_id: string
  iso_nombre: string
}

interface State {
  id: string
  nombre: string
  nombre_completo: string
  provincia: {
    id: string
    nombre: string
    interseccion: number
  }
  fuente: string
  categoria: string
  centroide: Centroide
}

interface Centroide {
  lon: number
  lat: number
}

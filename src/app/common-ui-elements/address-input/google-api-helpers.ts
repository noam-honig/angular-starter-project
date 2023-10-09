/// <reference types="@types/googlemaps" />

export function getCity(address_component: AddressComponent[]) {
  let r = undefined
  address_component.forEach((x) => {
    if (x.types[0] == 'locality') r = x.long_name
  })
  if (!r)
    address_component.forEach((x) => {
      if (x.types[0] == 'postal_town') r = x.long_name
    })
  if (!r) return 'UNKNOWN'
  return r
}
export function getAddress(result: {
  formatted_address?: string
  address_components?: AddressComponent[]
}) {
  let r = result.formatted_address
  if (!r) return 'UNKNOWN'
  if (result.address_components)
    for (
      let index = result.address_components.length - 1;
      index >= 0;
      index--
    ) {
      const x = result.address_components[index]
      if (x.types[0] == 'country' || x.types[0] == 'postal_code') {
        let i = r.lastIndexOf(', ' + x.long_name)
        if (i > 0)
          r = r.substring(0, i) + r.substring(i + x.long_name.length + 2)
      }
      if (
        x.types[0] == 'administrative_area_level_2' &&
        x.short_name.length == 2
      ) {
        let i = r.lastIndexOf(' ' + x.short_name)
        if (i > 0)
          r = r.substring(0, i) + r.substring(i + x.long_name.length + 1)
      }
    }

  r = r.trim()
  if (r.endsWith(',')) {
    r = r.substring(0, r.length - 1)
  }
  return r
}
export interface AddressComponent {
  long_name: string
  short_name: string
  types: string[]
}

export interface Location {
  lat: number
  lng: number
}

export interface GeocodeResult {
  results: Result[]
  status: string
}
export interface Result {
  address_components?: AddressComponent[]
  formatted_address?: string
  geometry: Geometry
  partial_match: boolean
  place_id: string
  types: string[]
}

export interface Geometry {
  location: Location
  location_type: string
  viewport: Viewport
}
export interface Viewport {
  northeast: Location
  southwest: Location
}

export function parseUrlInAddress(address: string) {
  let x = address.toLowerCase()
  let search = 'https://maps.google.com/maps?q='
  if (x.startsWith(search)) {
    x = x.substring(search.length, 1000)
    let i = x.indexOf('&')
    if (i >= 0) {
      x = x.substring(0, i)
    }
    x = x.replace('%2c', ',')
    return x
  } else if (x.startsWith('https://www.google.com/maps/place/')) {
    let r = x.split('!3d')
    if (r.length > 0) {
      x = r[r.length - 1]
      let j = x.split('!4d')
      x = j[0] + ',' + j[1]
      let i = x.indexOf('!')
      if (i > 0) {
        x = x.substring(0, i)
      }
      return leaveOnlyNumericChars(x)
    }
  } else if (x.indexOf('מיקום:') >= 0) {
    let j = x.substring(x.indexOf('מיקום:') + 6)
    let k = j.indexOf('דיוק')
    if (k > 0) {
      j = j.substring(0, k)
      j = leaveOnlyNumericChars(j)
      if (j.indexOf(',') > 0) return j
    }
  }
  if (isGpsAddress(address)) {
    let x = address.split(',')
    return (+x[0]).toFixed(6) + ',' + (+x[1]).toFixed(6)
  }

  return address
}
export function leaveOnlyNumericChars(x: string) {
  for (let index = 0; index < x.length; index++) {
    switch (x[index]) {
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
      case '0':
      case '.':
      case ',':
      case ' ':
        break
      default:
        return x.substring(0, index)
    }
  }
  return x
}
export function isGpsAddress(address: string) {
  if (!address) return false
  let x = leaveOnlyNumericChars(address)
  if (x == address && x.indexOf(',') > 5) return true
  return false
}

/// <reference types="@types/googlemaps" />

import { UIToolsService } from '../UIToolsService'

export function getDistrict(g: GeocodeResult | undefined | null) {
  if (!g?.district) return getGoogleRegion(g)
  switch (g.district) {
    case '444':
      return 'ירקון'
    case 'נגב':
      switch (g.branch) {
        case 'אופקים':
        case 'נתיבות':
        case 'שדרות':
          return 'עוטף עזה'
        case 'ערד':
          return 'ים המלח'
        case 'באר שבע':
          return 'נגב צפוני'
        case 'אילות':
          return 'נגב דרומי'

        default:
          return g.branch
      }
  }
  return g.district
}

export function getCity(g: GeocodeResult | undefined | null) {
  const address_component = g?.results[0]?.address_components
  let r = undefined
  if (address_component) {
    address_component.forEach((x) => {
      if (x.types.includes('locality')) r = x.long_name
    })
    if (!r)
      address_component.forEach((x) => {
        if (x.types.includes('postal_town')) r = x.long_name
      })
    if (!r) r = g.branch
    if (!r)
      address_component.forEach((x) => {
        if (x.types.includes('administrative_area_level_1')) r = x.long_name
      })
  }
  if (!g) return 'ישראל'
  if (!r) return address_component?.[0]?.short_name || g.branch || g.district
  return r
}
const districtToRegion = new Map<string, string>()
function getGoogleRegion(r: GeocodeResult | undefined | null) {
  if (r?.results?.[0]?.address_components) {
    for (const x of r.results[0].address_components) {
      if (x.types.includes('administrative_area_level_1')) {
        let result = x.short_name
        switch (result) {
          case 'Center District':
            result = 'מחוז המרכז'
            break
          case 'South District':
            result = 'מחוז הדרום'
            break
          case 'North District':
            result = 'מחוז הצפון'
            break
          case 'Tel Aviv District':
            result = 'מחוז תל אביב'
            break
        }
        return result.replace(/מחוז ה/g, '').replace(/מחוז /g, '')
      }
    }
  }
  if (r?.district) return r.district
  if (r?.branch) return r.branch
  const city = getCity(r)
  if (city) return city
  return 'לא ידוע'
}
export function getRegion(r: GeocodeResult | undefined | null): string {
  switch (getDistrict(r)) {
    case 'לכיש':
    case 'נגב':
    case 'עוטף עזה':
    case 'ים המלח':
    case 'נגב צפוני':
    case 'נגב דרומי':
    case 'דימונה - ירוחם':
      return 'אזור דרום'
    case 'איילון':
    case 'ירושלים':
    case 'בנימין':
      return 'אזור ירושלים'

    case '444':
    case 'אונו':
    case 'דן':
    case 'ירקון':
    case 'שומרון':
    case 'שפלה':
    case 'שרון':
      return 'אזור מרכז'
    case 'משגב':
    case 'כנרת':
    case 'אשר':
    case 'זבולון':
    case 'כרמל':
    case 'בקעת הירדן':
    case 'גליל':
    case 'גולן':
    case 'העמקים':
    case 'מנשה':
      return 'אזור צפון'
  }

  return getGoogleRegion(r)
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
        let i: number = r.lastIndexOf(', ' + x.long_name)
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
  if (r == 'נגב') return 'דרום'
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
  district?: string
  branch?: string
}
export interface Result {
  address_components?: AddressComponent[]
  formatted_address?: string
  geometry: Geometry
  partial_match?: boolean
  place_id?: string
  types?: string[]
}

export interface Geometry {
  location: Location
  location_type?: string
  viewport?: Viewport
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

export function openWaze(longLat: string, address: string) {
  if (isDesktop())
    window.open(
      'https://waze.com/ul?ll=' +
        longLat +
        '&q=' +
        encodeURI(address) +
        '&navigate=yes',
      '_blank'
    )
  else
    try {
      location.href =
        'waze://?ll=' +
        longLat +
        /*"&q=" + encodeURI(this.address) +*/ '&navigate=yes'
    } catch (err) {
      console.log(err)
    }
}
export function isDesktop() {
  const navigatorAgent =
    //@ts-ignore
    navigator.userAgent || navigator.vendor || window.opera
  return !(
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series([46])0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
      navigatorAgent
    ) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br([ev])w|bumb|bw-([nu])|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do([cp])o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly([-_])|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-([mpt])|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c([- _agpst])|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac([ \-/])|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja([tv])a|jbro|jemu|jigs|kddi|keji|kgt([ /])|klon|kpt |kwc-|kyo([ck])|le(no|xi)|lg( g|\/([klu])|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t([- ov])|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30([02])|n50([025])|n7(0([01])|10)|ne(([cm])-|on|tf|wf|wg|wt)|nok([6i])|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan([adt])|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c([-01])|47|mc|nd|ri)|sgh-|shar|sie([-m])|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel([im])|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c([- ])|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(
      navigatorAgent.substr(0, 4)
    )
  )
}
export function toLongLat(l: Location) {
  return l.lat + ',' + l.lng
}
export function getLongLat(addressApiResult: GeocodeResult | null): string {
  return toLongLat(getLocation(addressApiResult)!)!
}
export const EMPTY_LOCATION: Location = { lat: 0, lng: 0 }
export function getLocation(addressApiResult: GeocodeResult | null): Location {
  return addressApiResult?.results?.[0]?.geometry?.location || EMPTY_LOCATION
}

// import geometry, { computeDistanceBetween } from 'spherical-geometry-js'
// export function GetDistanceBetween(a: Location, b: Location) {
//   if (!a || !b || a == EMPTY_LOCATION || b == EMPTY_LOCATION) return 0
//   return computeDistanceBetween(a, b) / 1000
// }

export async function getCurrentLocation() {
  return await new Promise<Location>((res, rej) => {
    navigator.geolocation.getCurrentPosition((x) => {
      res({
        lat: x.coords.latitude,
        lng: x.coords.longitude,
      })
    }, rej)
  })
}
let cache = new Map<string, Promise<GeocodeResult>>()
export async function GetGeoInformation(address: string) {
  let result = cache.get(address)
  if (!result) {
    cache.set(address, (result = InternalGetGeoInformation(address)))
  }
  return result
}
async function InternalGetGeoInformation(address: string) {
  if (!address || address == '' || address.trim() == '') return undefined
  const fetch = await import('node-fetch')
  address = address.trim()
  let u = 'https://maps.googleapis.com/maps/api/geocode/json?'
  const params = new URLSearchParams({
    key: process.env['GOOGLE_GECODE_API_KEY']!,
    address,
    language: 'he',
  })
  const url = u + params.toString()
  console.log(url)
  let r = await fetch.default(url).then((x) => x.json())
  return r
}

export function getGoogleMapLink(api?: GeocodeResult | null) {
  if (!api) return ''
  return 'https://maps.google.com/maps?q=' + getLongLat(api) + '&hl=he'
}

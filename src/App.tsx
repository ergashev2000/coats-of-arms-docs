import { Coat, Flag } from 'coat-of-arms'
import { useState, useMemo } from 'react'

interface Country {
  code: string
  name: string
}

const COUNTRIES: Country[] = [
  { code: "AD", name: "Andorra" }, { code: "AE", name: "United Arab Emirates" },
  { code: "AF", name: "Afghanistan" }, { code: "AG", name: "Antigua and Barbuda" },
  { code: "AI", name: "Anguilla" }, { code: "AL", name: "Albania" },
  { code: "AM", name: "Armenia" }, { code: "AO", name: "Angola" },
  { code: "AR", name: "Argentina" }, { code: "AS", name: "American Samoa" },
  { code: "AT", name: "Austria" }, { code: "AU", name: "Australia" },
  { code: "AW", name: "Aruba" }, { code: "AZ", name: "Azerbaijan" },
  { code: "BA", name: "Bosnia and Herzegovina" }, { code: "BB", name: "Barbados" },
  { code: "BD", name: "Bangladesh" }, { code: "BE", name: "Belgium" },
  { code: "BF", name: "Burkina Faso" }, { code: "BG", name: "Bulgaria" },
  { code: "BH", name: "Bahrain" }, { code: "BI", name: "Burundi" },
  { code: "BJ", name: "Benin" }, { code: "BL", name: "Saint Barthélemy" },
  { code: "BM", name: "Bermuda" }, { code: "BN", name: "Brunei" },
  { code: "BO", name: "Bolivia" }, { code: "BR", name: "Brazil" },
  { code: "BS", name: "Bahamas" }, { code: "BT", name: "Bhutan" },
  { code: "BW", name: "Botswana" }, { code: "BY", name: "Belarus" },
  { code: "BZ", name: "Belize" }, { code: "CA", name: "Canada" },
  { code: "CH", name: "Switzerland" }, { code: "CI", name: "Côte d'Ivoire" },
  { code: "CK", name: "Cook Islands" }, { code: "CL", name: "Chile" },
  { code: "CM", name: "Cameroon" }, { code: "CN", name: "China" },
  { code: "CO", name: "Colombia" }, { code: "CR", name: "Costa Rica" },
  { code: "CV", name: "Cape Verde" }, { code: "CW", name: "Curaçao" },
  { code: "CY", name: "Cyprus" }, { code: "CZ", name: "Czech Republic" },
  { code: "DE", name: "Germany" }, { code: "DJ", name: "Djibouti" },
  { code: "DK", name: "Denmark" }, { code: "DM", name: "Dominica" },
  { code: "DO", name: "Dominican Republic" }, { code: "DZ", name: "Algeria" },
  { code: "EC", name: "Ecuador" }, { code: "EE", name: "Estonia" },
  { code: "EG", name: "Egypt" }, { code: "EH", name: "Western Sahara" },
  { code: "ER", name: "Eritrea" }, { code: "ES", name: "Spain" },
  { code: "ET", name: "Ethiopia" }, { code: "FI", name: "Finland" },
  { code: "FJ", name: "Fiji" }, { code: "FO", name: "Faroe Islands" },
  { code: "FR", name: "France" }, { code: "GA", name: "Gabon" },
  { code: "GB", name: "United Kingdom" }, { code: "GD", name: "Grenada" },
  { code: "GE", name: "Georgia" }, { code: "GG", name: "Guernsey" },
  { code: "GH", name: "Ghana" }, { code: "GI", name: "Gibraltar" },
  { code: "GL", name: "Greenland" }, { code: "GN", name: "Guinea" },
  { code: "GP", name: "Guadeloupe" }, { code: "GQ", name: "Equatorial Guinea" },
  { code: "GR", name: "Greece" }, { code: "GS", name: "South Georgia" },
  { code: "GT", name: "Guatemala" }, { code: "GU", name: "Guam" },
  { code: "GW", name: "Guinea-Bissau" }, { code: "GY", name: "Guyana" },
  { code: "HK", name: "Hong Kong" }, { code: "HN", name: "Honduras" },
  { code: "HR", name: "Croatia" }, { code: "HT", name: "Haiti" },
  { code: "HU", name: "Hungary" }, { code: "ID", name: "Indonesia" },
  { code: "IE", name: "Ireland" }, { code: "IL", name: "Israel" },
  { code: "IN", name: "India" }, { code: "IO", name: "British Indian Ocean Territory" },
  { code: "IQ", name: "Iraq" }, { code: "IS", name: "Iceland" },
  { code: "IT", name: "Italy" }, { code: "JE", name: "Jersey" },
  { code: "JM", name: "Jamaica" }, { code: "JO", name: "Jordan" },
  { code: "JP", name: "Japan" }, { code: "KE", name: "Kenya" },
  { code: "KG", name: "Kyrgyzstan" }, { code: "KH", name: "Cambodia" },
  { code: "KI", name: "Kiribati" }, { code: "KM", name: "Comoros" },
  { code: "KN", name: "Saint Kitts and Nevis" }, { code: "KP", name: "North Korea" },
  { code: "KR", name: "South Korea" }, { code: "KW", name: "Kuwait" },
  { code: "KZ", name: "Kazakhstan" }, { code: "LB", name: "Lebanon" },
  { code: "LC", name: "Saint Lucia" }, { code: "LI", name: "Liechtenstein" },
  { code: "LK", name: "Sri Lanka" }, { code: "LR", name: "Liberia" },
  { code: "LS", name: "Lesotho" }, { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" }, { code: "LV", name: "Latvia" },
  { code: "LY", name: "Libya" }, { code: "MA", name: "Morocco" },
  { code: "MC", name: "Monaco" }, { code: "ME", name: "Montenegro" },
  { code: "MG", name: "Madagascar" }, { code: "MH", name: "Marshall Islands" },
  { code: "ML", name: "Mali" }, { code: "MM", name: "Myanmar" },
  { code: "MN", name: "Mongolia" }, { code: "MQ", name: "Martinique" },
  { code: "MR", name: "Mauritania" }, { code: "MS", name: "Montserrat" },
  { code: "MT", name: "Malta" }, { code: "MU", name: "Mauritius" },
  { code: "MV", name: "Maldives" }, { code: "MW", name: "Malawi" },
  { code: "MX", name: "Mexico" }, { code: "MY", name: "Malaysia" },
  { code: "MZ", name: "Mozambique" }, { code: "NA", name: "Namibia" },
  { code: "NC", name: "New Caledonia" }, { code: "NE", name: "Niger" },
  { code: "NF", name: "Norfolk Island" }, { code: "NG", name: "Nigeria" },
  { code: "NI", name: "Nicaragua" }, { code: "NL", name: "Netherlands" },
  { code: "NO", name: "Norway" }, { code: "NP", name: "Nepal" },
  { code: "NR", name: "Nauru" }, { code: "NU", name: "Niue" },
  { code: "NZ", name: "New Zealand" }, { code: "OM", name: "Oman" },
  { code: "PA", name: "Panama" }, { code: "PE", name: "Peru" },
  { code: "PF", name: "French Polynesia" }, { code: "PG", name: "Papua New Guinea" },
  { code: "PH", name: "Philippines" }, { code: "PK", name: "Pakistan" },
  { code: "PL", name: "Poland" }, { code: "PM", name: "Saint Pierre and Miquelon" },
  { code: "PR", name: "Puerto Rico" }, { code: "PT", name: "Portugal" },
  { code: "PW", name: "Palau" }, { code: "PY", name: "Paraguay" },
  { code: "QA", name: "Qatar" }, { code: "RE", name: "Réunion" },
  { code: "RO", name: "Romania" }, { code: "RS", name: "Serbia" },
  { code: "RU", name: "Russia" }, { code: "RW", name: "Rwanda" },
  { code: "SA", name: "Saudi Arabia" }, { code: "SB", name: "Solomon Islands" },
  { code: "SC", name: "Seychelles" }, { code: "SD", name: "Sudan" },
  { code: "SE", name: "Sweden" }, { code: "SH", name: "Saint Helena" },
  { code: "SI", name: "Slovenia" }, { code: "SK", name: "Slovakia" },
  { code: "SL", name: "Sierra Leone" }, { code: "SM", name: "San Marino" },
  { code: "SN", name: "Senegal" }, { code: "SO", name: "Somalia" },
  { code: "SR", name: "Suriname" }, { code: "SS", name: "South Sudan" },
  { code: "ST", name: "São Tomé and Príncipe" }, { code: "SV", name: "El Salvador" },
  { code: "SZ", name: "Eswatini" }, { code: "TC", name: "Turks and Caicos Islands" },
  { code: "TD", name: "Chad" }, { code: "TG", name: "Togo" },
  { code: "TH", name: "Thailand" }, { code: "TJ", name: "Tajikistan" },
  { code: "TK", name: "Tokelau" }, { code: "TL", name: "Timor-Leste" },
  { code: "TM", name: "Turkmenistan" }, { code: "TN", name: "Tunisia" },
  { code: "TO", name: "Tonga" }, { code: "TT", name: "Trinidad and Tobago" },
  { code: "TV", name: "Tuvalu" }, { code: "UA", name: "Ukraine" },
  { code: "UG", name: "Uganda" }, { code: "US", name: "United States" },
  { code: "UY", name: "Uruguay" }, { code: "UZ", name: "Uzbekistan" },
  { code: "VC", name: "Saint Vincent and the Grenadines" }, { code: "VE", name: "Venezuela" },
  { code: "VN", name: "Vietnam" }, { code: "VU", name: "Vanuatu" },
  { code: "WS", name: "Samoa" }, { code: "XK", name: "Kosovo" },
  { code: "YE", name: "Yemen" }, { code: "YT", name: "Mayotte" },
  { code: "ZA", name: "South Africa" }, { code: "ZM", name: "Zambia" },
  { code: "ZW", name: "Zimbabwe" }
]

export default function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [copied, setCopied] = useState(false)

  const filteredCountries = useMemo(() => {
    const term = searchTerm.toLowerCase().trim()
    if (!term) return COUNTRIES

    return COUNTRIES.filter(country =>
      country.code.toLowerCase().includes(term) ||
      country.name.toLowerCase().includes(term)
    )
  }, [searchTerm])

  const getBorderColor = () => {
    if (!searchTerm) return 'border-gray-300'
    return filteredCountries.length === 0 ? 'border-red-500' : 'border-green-500'
  }
  const copyToClipboard = () => {
    navigator.clipboard.writeText('npm i coat-of-arms')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-5 max-w-6xl mx-auto">

      <div className='bg-[#464646e8] text-[#f5f5f5] w-[400px] font-medium text-lg rounded-lg shadow-md py-1.5 px-3 mb-5 flex items-center justify-between'>
        <span>npm i coat-of-arms</span>
        <button className='cursor-pointer bg-blue-500 text-[#f5f5f5] px-3 py-1.5 rounded-lg transition-colors duration-300 hover:bg-blue-600' onClick={copyToClipboard}>{copied ? 'Copied!' : 'Copy'}</button>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-5">
        <h2 className="text-2xl font-bold mb-5">🏳️ All Countries - Flags & Coats of Arms</h2>

        <div className="mb-5">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by country name or code..."
            className={`w-full px-4 py-2 text-base border-2 ${getBorderColor()} rounded-lg transition-colors duration-300 focus:outline-none focus:border-blue-500`}
          />
        </div>

        <p className="mb-5 text-gray-700">
          Showing: <strong className="font-bold">{filteredCountries.length}</strong> / <strong className="font-bold">{COUNTRIES.length}</strong> countries
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCountries.map((country) => (
            <div key={country.code} className="bg-gray-50 p-3 rounded-2xl flex items-center gap-4 hover:bg-gray-100 transition-colors">
              <div className="flex gap-3 items-center">
                <Flag country={country.code} size="xl" />
                <Coat country={country.code} size="xs" />
              </div>
              <div>
                <strong className="font-semibold text-gray-900 text-2xl">{country.name}</strong><br />
                <code className="text-lg text-gray-600">{country.code}</code>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-3">📐 Size</h2>
        <p className="mb-4 text-gray-700">Coat of arms in different sizes:</p>
        <div className="flex gap-3 items-end flex-wrap">
          <Coat country="UZ" size="xs" />
          <Coat country="UZ" size="sm" />
          <Coat country="UZ" size="md" />
          <Coat country="UZ" size="lg" />
          <Coat country="UZ" size="xl" />
        </div>
      </div>
    </div>
  )
}

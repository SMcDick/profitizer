const taxRates = [
	{ name: "Appling", value: "8" },
	{ name: "Atkinson", value: "7" },
	{ name: "Bacon", value: "7" },
	{ name: "Baker", value: "7" },
	{ name: "Baldwin", value: "7" },
	{ name: "Banks", value: "7" },
	{ name: "Barrow", value: "7" },
	{ name: "Bartow", value: "7" },
	{ name: "Ben Hill", value: "7" },
	{ name: "Berrien", value: "7" },
	{ name: "Bibb", value: "7" },
	{ name: "Bleckley", value: "8" },
	{ name: "Brantley", value: "7" },
	{ name: "Brooks", value: "7" },
	{ name: "Bryan", value: "7" },
	{ name: "Bulloch", value: "7" },
	{ name: "Burke", value: "7" },
	{ name: "Butts", value: "7" },
	{ name: "Calhoun", value: "7" },
	{ name: "Camden", value: "7" },
	{ name: "Candler", value: "8" },
	{ name: "Carroll", value: "7" },
	{ name: "Catoosa", value: "7" },
	{ name: "Charlton", value: "7" },
	{ name: "Chatham", value: "7" },
	{ name: "Chattahoochee", value: "8" },
	{ name: "Chattooga", value: "7" },
	{ name: "Cherokee", value: "6" },
	{ name: "Clarke", value: "8" },
	{ name: "Clay", value: "8" },
	{ name: "Clayton", value: "8" },
	{ name: "Clinch", value: "7" },
	{ name: "Cobb", value: "6" },
	{ name: "Coffee", value: "7" },
	{ name: "Colquitt", value: "8" },
	{ name: "Columbia", value: "8" },
	{ name: "Cook", value: "7" },
	{ name: "Coweta", value: "7" },
	{ name: "Crawford", value: "7" },
	{ name: "Crisp", value: "8" },
	{ name: "Dade", value: "7" },
	{ name: "Dawson", value: "7" },
	{ name: "Decatur", value: "8" },
	{ name: "DeKalb (Not Atlanta)", value: "8" },
	{ name: "DeKalb (In Atlanta)", value: "8.9" },
	{ name: "Dodge", value: "8" },
	{ name: "Dooly", value: "8" },
	{ name: "Dougherty", value: "7" },
	{ name: "Douglas", value: "7" },
	{ name: "Early", value: "7" },
	{ name: "Echols", value: "7" },
	{ name: "Effingham", value: "7" },
	{ name: "Elbert", value: "7" },
	{ name: "Emanuel", value: "8" },
	{ name: "Evans", value: "8" },
	{ name: "Fannin", value: "7" },
	{ name: "Fayette", value: "7" },
	{ name: "Floyd", value: "7" },
	{ name: "Forsyth", value: "7" },
	{ name: "Franklin", value: "7" },
	{ name: "Fulton (Not Atlanta)", value: "7.7" },
	{ name: "Fulton (In Atlanta)", value: "8.9" },
	{ name: "Gilmer", value: "7" },
	{ name: "Glascock", value: "8" },
	{ name: "Glynn", value: "7" },
	{ name: "Gordon", value: "7" },
	{ name: "Grady", value: "7" },
	{ name: "Greene", value: "7" },
	{ name: "Gwinnett", value: "6" },
	{ name: "Habersham", value: "7" },
	{ name: "Hall", value: "7" },
	{ name: "Hancock", value: "8" },
	{ name: "Haralson", value: "8" },
	{ name: "Harris", value: "8" },
	{ name: "Hart", value: "7" },
	{ name: "Heard", value: "7" },
	{ name: "Henry", value: "7" },
	{ name: "Houston", value: "7" },
	{ name: "Irwin", value: "7" },
	{ name: "Jackson", value: "7" },
	{ name: "Jasper", value: "7" },
	{ name: "Jeff Davis", value: "8" },
	{ name: "Jefferson", value: "8" },
	{ name: "Jenkins", value: "8" },
	{ name: "Johnson", value: "8" },
	{ name: "Jones", value: "7" },
	{ name: "Lamar", value: "7" },
	{ name: "Lanier", value: "7" },
	{ name: "Laurens", value: "8" },
	{ name: "Lee", value: "7" },
	{ name: "Liberty", value: "7" },
	{ name: "Lincoln", value: "8" },
	{ name: "Long", value: "7" },
	{ name: "Lowndes", value: "7" },
	{ name: "Lumpkin", value: "7" },
	{ name: "Macon", value: "8" },
	{ name: "Madison", value: "7" },
	{ name: "Marion", value: "8" },
	{ name: "McDuffie", value: "8" },
	{ name: "McIntosh", value: "7" },
	{ name: "Meriwether", value: "7" },
	{ name: "Miller", value: "7" },
	{ name: "Mitchell", value: "7" },
	{ name: "Monroe", value: "7" },
	{ name: "Montgomery", value: "8" },
	{ name: "Morgan", value: "7" },
	{ name: "Murray", value: "7" },
	{ name: "Muscogee", value: "8" },
	{ name: "Newton", value: "7" },
	{ name: "Oconee", value: "7" },
	{ name: "Oglethorpe", value: "7" },
	{ name: "Paulding", value: "7" },
	{ name: "Peach", value: "7" },
	{ name: "Pickens", value: "7" },
	{ name: "Pierce", value: "7" },
	{ name: "Pike", value: "7" },
	{ name: "Polk", value: "7" },
	{ name: "Pulaski", value: "7" },
	{ name: "Putnam", value: "8" },
	{ name: "Quitman", value: "8" },
	{ name: "Rabun", value: "7" },
	{ name: "Randolph", value: "8" },
	{ name: "Richmond", value: "8" },
	{ name: "Rockdale", value: "7" },
	{ name: "Schley", value: "8" },
	{ name: "Screven", value: "7" },
	{ name: "Seminole", value: "7" },
	{ name: "Spalding", value: "7" },
	{ name: "Stephens", value: "7" },
	{ name: "Stewart", value: "8" },
	{ name: "Sumter", value: "8" },
	{ name: "Talbot", value: "8" },
	{ name: "Taliaferro", value: "8" },
	{ name: "Tattnall", value: "8" },
	{ name: "Taylor", value: "8" },
	{ name: "Telfair", value: "8" },
	{ name: "Terrell", value: "7" },
	{ name: "Thomas", value: "7" },
	{ name: "Tift", value: "7" },
	{ name: "Toombs", value: "8" },
	{ name: "Towns", value: "7" },
	{ name: "Treutlen", value: "8" },
	{ name: "Troup", value: "7" },
	{ name: "Turner", value: "7" },
	{ name: "Twiggs", value: "7" },
	{ name: "Union", value: "7" },
	{ name: "Upson", value: "7" },
	{ name: "Walker", value: "8" },
	{ name: "Walton", value: "7" },
	{ name: "Ware", value: "8" },
	{ name: "Warren", value: "8" },
	{ name: "Washington", value: "8" },
	{ name: "Wayne", value: "8" },
	{ name: "Webster", value: "8" },
	{ name: "Wheeler", value: "8" },
	{ name: "White", value: "7" },
	{ name: "Whitfield", value: "7" },
	{ name: "Wilcox", value: "8" },
	{ name: "Wilkes", value: "8" },
	{ name: "Wilkinson", value: "7" },
	{ name: "Worth", value: "7" }
]
export default taxRates

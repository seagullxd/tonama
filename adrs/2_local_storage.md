## Local Storage
|||
|---|---|
| Date created | 08/09/2025 |
| Outcome | Approved |

Document to investigate the appropriate means of player data storage on the browser. The aim is to keep data storage simple.

#### Reasons for the decision
1. To decide how to handle a player's data
	1. levels completed & in-progress, in-progress levels (country guesses & hints used), daily games streak, total points

#### Suitable approach(es)
1. Local storage
	* persistent data
	* light storage - up to 5-10mb of data per domain
	* stores data as simple key-value pair
	* key-value storage
	* accessible via JavaScript
	* not sent to the server 

#### Alternatives considered
- Session storage
	* temporary storage
	* storage limit - up to 5-10mb of data per domain
	* key-value storage 
	* not sent to the server — Only accessible via the browser
- Cookies
	* limited Storage — 4KB per cookie
	* data sent to the server — included in every HTTP request
	* can have expiry dates — persistent or session-based cookies
	* supports secure storage

#### Considerations
- You may need to consider a db solution in future
- Local storage is accessible through JavaScript running in the browser
	* Data stored here is vulnerable to cross-site scripting (XSS) attacks
	* Attacker can inject client-side scripts, such as JavaScript, into a web app in order to gain access to sensitive information.
- Cookies are better suited for storing sensitive data than localStorage or sessionStorage
- A user can manipulate their local browser data

#### References
| # | Reference |
|---|---|
| 1 | www.youtube.com/watch?v=OOcxXyckmcs |
| 2 | dev.to/aneeqakhan/a-developers-guide-to-browser-storage-local-storage-session-storage-and-cookies-4c5f |
| 3 | www.telerik.com/blogs/three-browser-storage-mechanisms |
| 4 | medium.com/@shahbazmehmood61/exploring-browser-storage-options-a-comprehensive-guide-012d58a655a7 |
| 5 | web.dev/articles/storage-for-the-web |
| 6 | www.ramotion.com/blog/what-is-web-storage/#section-types-of-web-storage |

#### Helpful
| # | Resources |
|---|---|
| 1 | blog.logrocket.com/storing-retrieving-javascript-objects-localstorage/ |
| 2 | www.dynetisgames.com/2018/10/28/how-save-load-player-progress-localstorage/ |
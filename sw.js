var	filesToCache	=	[
		'.',
		'/app/style/main.css',
		'/app/images/still_life_medium.jpg',
		'/app/images/birds_medium.jpg',
  		'/app/images/horses_medium.jpg',
  		'/app/images/volt_medium.jpg',
		'/app/index.html',
		'/app/pages/offline.html',
		'/app/pages/404.html'
];
var	staticCacheName	=	'pages-cache-v2';
self.addEventListener('install',	function(event)	{
		console.log('Attempting	to	install	service	worker	and	cache	static	assets');
		event.waitUntil(
			caches.open(staticCacheName)
			.then(function(cache)	{
				return	cache.addAll(filesToCache);
				})
		);
});
self.addEventListener('activate',	function(event)	{
		console.log('Activating	new	service	worker...');
		var	cacheWhitelist	=	[staticCacheName];
		event.waitUntil(
			caches.keys().then(function(cacheNames)	{
				return	Promise.all(
			cacheNames.map(function(cacheName)	{
			if	(cacheWhitelist.indexOf(cacheName)	===	-1)	{
				return	caches.delete(cacheName);
										}
								})
						);
				})
		);
});
self.addEventListener('fetch',	function(event)	{
		console.log('Fetch	event	for	',	event.request.url);
		event.respondWith(
			caches.match(event.request).then(function(response)	{
				if	(response)	{
					console.log('Found	',	event.request.url,	'	in	cache');
						return	response;
				}
				console.log('Network	request	for	',	event.request.url);
					return	fetch(event.request)
				//	TODO	4	-	Add	fetched	files	to	the	cache
				.then(function(response)	{
				//	TODO	5	-	Respond	with	custom	404	page
					return	caches.open(staticCacheName).then(function(cache)	{
				if	(event.request.url.indexOf('test')	<	0)	{
						cache.put(event.request.url,	response.clone());
				}
				return	response;
		});
});
				}).catch(error => {
      console.log('Error, ', error);
      return caches.match('pages/offline.html');
    })
  );
});

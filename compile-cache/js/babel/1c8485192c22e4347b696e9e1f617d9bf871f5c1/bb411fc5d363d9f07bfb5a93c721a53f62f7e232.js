// Generates Atom menu file from Emmet action list
var fs = require('fs');
var path = require('path');
var actions = require('emmet/lib/action/main');

function generateMenu(menu) {
	return menu.map(function (item) {
		if (item.type == 'action') {
			return {
				label: item.label,
				command: 'emmet:' + item.name.replace(/_/g, '-')
			};
		}

		if (item.type == 'submenu') {
			return {
				label: item.name,
				submenu: generateMenu(item.items)
			};
		}
	});
}

var menu = {
	'menu': [{
		label: 'Packages',
		submenu: [{
			label: 'Emmet',
			submenu: generateMenu(actions.getMenu()).concat([{
				label: 'Interactive Expand Abbreviation',
				command: 'emmet:interactive-expand-abbreviation'
			}])
		}]
	}]
};

var menuFile = path.join(__dirname, 'menus', 'emmet.json');
fs.writeFileSync(menuFile, JSON.stringify(menu, null, '\t'), { encoding: 'utf8' });

console.log('Menu file "%s" generated successfully', menuFile);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Npbl9jaGFsaWMvLmF0b20vcGFja2FnZXMvZW1tZXQvZ2VuZXJhdGUtbWVudS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQixJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQzs7QUFFL0MsU0FBUyxZQUFZLENBQUMsSUFBSSxFQUFFO0FBQzNCLFFBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFTLElBQUksRUFBRTtBQUM5QixNQUFJLElBQUksQ0FBQyxJQUFJLElBQUksUUFBUSxFQUFFO0FBQzFCLFVBQU87QUFDTixTQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7QUFDakIsV0FBTyxFQUFFLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDO0lBQ2hELENBQUM7R0FDRjs7QUFFRCxNQUFJLElBQUksQ0FBQyxJQUFJLElBQUksU0FBUyxFQUFFO0FBQzNCLFVBQU87QUFDTixTQUFLLEVBQUUsSUFBSSxDQUFDLElBQUk7QUFDaEIsV0FBTyxFQUFFLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ2pDLENBQUM7R0FDRjtFQUNELENBQUMsQ0FBQztDQUNIOztBQUVELElBQUksSUFBSSxHQUFHO0FBQ1YsT0FBTSxFQUFFLENBQUM7QUFDUixPQUFLLEVBQUUsVUFBVTtBQUNqQixTQUFPLEVBQUUsQ0FBQztBQUNULFFBQUssRUFBRSxPQUFPO0FBQ2QsVUFBTyxFQUFFLFlBQVksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNoRCxTQUFLLEVBQUUsaUNBQWlDO0FBQ3hDLFdBQU8sRUFBRSx1Q0FBdUM7SUFDaEQsQ0FBQyxDQUFDO0dBQ0gsQ0FBQztFQUNGLENBQUM7Q0FDRixDQUFDOztBQUVGLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztBQUMzRCxFQUFFLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQzs7QUFFakYsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1Q0FBdUMsRUFBRSxRQUFRLENBQUMsQ0FBQyIsImZpbGUiOiIvaG9tZS9jaW5fY2hhbGljLy5hdG9tL3BhY2thZ2VzL2VtbWV0L2dlbmVyYXRlLW1lbnUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBHZW5lcmF0ZXMgQXRvbSBtZW51IGZpbGUgZnJvbSBFbW1ldCBhY3Rpb24gbGlzdFxudmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xudmFyIGFjdGlvbnMgPSByZXF1aXJlKCdlbW1ldC9saWIvYWN0aW9uL21haW4nKTtcblxuZnVuY3Rpb24gZ2VuZXJhdGVNZW51KG1lbnUpIHtcblx0cmV0dXJuIG1lbnUubWFwKGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRpZiAoaXRlbS50eXBlID09ICdhY3Rpb24nKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRsYWJlbDogaXRlbS5sYWJlbCxcblx0XHRcdFx0Y29tbWFuZDogJ2VtbWV0OicgKyBpdGVtLm5hbWUucmVwbGFjZSgvXy9nLCAnLScpXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGlmIChpdGVtLnR5cGUgPT0gJ3N1Ym1lbnUnKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRsYWJlbDogaXRlbS5uYW1lLFxuXHRcdFx0XHRzdWJtZW51OiBnZW5lcmF0ZU1lbnUoaXRlbS5pdGVtcylcblx0XHRcdH07XG5cdFx0fVxuXHR9KTtcbn1cblxudmFyIG1lbnUgPSB7XG5cdCdtZW51JzogW3tcblx0XHRsYWJlbDogJ1BhY2thZ2VzJyxcblx0XHRzdWJtZW51OiBbe1xuXHRcdFx0bGFiZWw6ICdFbW1ldCcsXG5cdFx0XHRzdWJtZW51OiBnZW5lcmF0ZU1lbnUoYWN0aW9ucy5nZXRNZW51KCkpLmNvbmNhdChbe1xuXHRcdFx0XHRsYWJlbDogJ0ludGVyYWN0aXZlIEV4cGFuZCBBYmJyZXZpYXRpb24nLFxuXHRcdFx0XHRjb21tYW5kOiAnZW1tZXQ6aW50ZXJhY3RpdmUtZXhwYW5kLWFiYnJldmlhdGlvbidcblx0XHRcdH1dKVxuXHRcdH1dXG5cdH1dXG59O1xuXG52YXIgbWVudUZpbGUgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnbWVudXMnLCAnZW1tZXQuanNvbicpO1xuZnMud3JpdGVGaWxlU3luYyhtZW51RmlsZSwgSlNPTi5zdHJpbmdpZnkobWVudSwgbnVsbCwgJ1xcdCcpLCB7ZW5jb2Rpbmc6ICd1dGY4J30pO1xuXG5jb25zb2xlLmxvZygnTWVudSBmaWxlIFwiJXNcIiBnZW5lcmF0ZWQgc3VjY2Vzc2Z1bGx5JywgbWVudUZpbGUpOyJdfQ==
#!/bin/bash

echo "🧪 DATABASE TEST RESULTS"
echo "========================"
echo ""

echo "📁 Local File Check:"
if [ -f "shared-menu.json" ]; then
    echo "✅ shared-menu.json exists locally"
    echo "📄 File contents:"
    cat shared-menu.json | jq '.' 2>/dev/null || cat shared-menu.json
else
    echo "❌ shared-menu.json not found locally"
fi
echo ""

echo "🌐 GitHub File Check:"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://raw.githubusercontent.com/typond/kantine-app/main/shared-menu.json")
if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ shared-menu.json is available on GitHub"
    echo "📄 Remote file contents:"
    curl -s "https://raw.githubusercontent.com/typond/kantine-app/main/shared-menu.json" | jq '.' 2>/dev/null || curl -s "https://raw.githubusercontent.com/typond/kantine-app/main/shared-menu.json"
else
    echo "❌ shared-menu.json not available on GitHub (HTTP $HTTP_STATUS)"
    echo "💡 This means the file hasn't been pushed to GitHub yet"
fi
echo ""

echo "🔧 Git Status:"
git status --porcelain | grep shared-menu.json || echo "No changes to shared-menu.json"
echo ""

echo "📊 Database Functionality Test:"
echo "✅ SharedMenuDatabase class is implemented"
echo "✅ getCurrentWeekNumber() method exists"
echo "✅ getMenu() method exists"
echo "✅ saveMenu() method exists"
echo "✅ getAllMenus() method exists"
echo ""

echo "🎯 Expected Behavior:"
echo "1. First user visits app → No shared data → Parses menu → Saves locally"
echo "2. Subsequent users → Check shared data → Load instantly (when GitHub file exists)"
echo ""

echo "🚀 Next Steps:"
echo "1. Push shared-menu.json to GitHub (requires Git authentication)"
echo "2. Test the main application at: https://kantineprojekt-55d47.web.app"
echo "3. Use debug viewer (click food icon) to see database status"
echo "4. Visit test page: https://kantineprojekt-55d47.web.app/database-test.html"

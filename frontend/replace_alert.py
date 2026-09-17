import os
import re

files_to_update = [
    r"c:\Users\abhijitbhunia\OneDrive - virtualemployee P Ltd\Desktop\PROFILEIQ\frontend\src\pages\ResumeBuilder.tsx",
    r"c:\Users\abhijitbhunia\OneDrive - virtualemployee P Ltd\Desktop\PROFILEIQ\frontend\src\pages\Projects.tsx",
    r"c:\Users\abhijitbhunia\OneDrive - virtualemployee P Ltd\Desktop\PROFILEIQ\frontend\src\pages\Opportunities.tsx",
    r"c:\Users\abhijitbhunia\OneDrive - virtualemployee P Ltd\Desktop\PROFILEIQ\frontend\src\pages\Matches.tsx",
    r"c:\Users\abhijitbhunia\OneDrive - virtualemployee P Ltd\Desktop\PROFILEIQ\frontend\src\pages\ManagerTeam.tsx",
    r"c:\Users\abhijitbhunia\OneDrive - virtualemployee P Ltd\Desktop\PROFILEIQ\frontend\src\pages\ManagerApplications.tsx",
    r"c:\Users\abhijitbhunia\OneDrive - virtualemployee P Ltd\Desktop\PROFILEIQ\frontend\src\pages\Applications.tsx",
    r"c:\Users\abhijitbhunia\OneDrive - virtualemployee P Ltd\Desktop\PROFILEIQ\frontend\src\components\admin\UserModal.tsx"
]

import_statement = "import { useToast } from '../context/ToastContext';\n"
import_statement_components = "import { useToast } from '../../context/ToastContext';\n"
toast_hook = "  const { toast } = useToast();\n"

for file_path in files_to_update:
    if not os.path.exists(file_path): continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "alert(" not in content:
        continue
        
    # Replace alert with toast
    content = content.replace("alert(", "toast(")
    
    # Add import
    import_path = import_statement_components if 'components' in file_path else import_statement
    if import_path not in content:
        # Find first import
        content = re.sub(r'(import .*?;?\n)', r'\1' + import_path, content, count=1)
        
    # Add hook inside the main function component
    # We find the export function [Name]
    content = re.sub(r'(export function [A-Za-z0-9_]+\s*\([^)]*\)\s*\{)', r'\1\n' + toast_hook, content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Updated {file_path}")

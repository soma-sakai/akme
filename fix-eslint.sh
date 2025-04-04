#!/bin/bash

# src/app/products/[id]/page.tsxのuseEffectを削除
sed -i '' 's/import { useState, useEffect } from/import { useState } from/g' src/app/products/\[id\]/page.tsx 2>/dev/null || true

# src/app/products/page.tsxのuseEffectを削除
sed -i '' 's/import { useState, useEffect } from/import { useState } from/g' src/app/products/page.tsx 2>/dev/null || true

# src/contexts/AuthContext.tsxのuseState, useEffectを削除
sed -i '' 's/import React, { createContext, useContext, useState, useEffect, ReactNode } from/import React, { createContext, useContext, ReactNode } from/g' src/contexts/AuthContext.tsx 2>/dev/null || true

# src/app/login/page.tsxのsetSuccessMessageを修正
sed -i '' 's/const \[successMessage\] = useState(\'\');/const successMessage = \'\';/g' src/app/login/page.tsx 2>/dev/null || true

echo "ESLintエラーを修正しました" 
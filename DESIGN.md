# SBTI 人格测试设计系统

## 1. Visual Theme & Atmosphere

**设计理念**: Warm Playful Gradient - 温暖活泼的渐变风格

结合了 Notion 的温暖极简和 Lovable 的趣味渐变，专为 Z 世代打造的趣味人格测试应用。整体感觉是：友好、活泼、有趣，但不失专业感。

**核心关键词**: 温暖、渐变、圆润、友好、趣味、现代

**氛围参考**: 
- 主背景温暖柔和，不是冷冰冰的白色
- 渐变色贯穿始终，增加活力感
- 大圆角设计，友好无攻击性
- 动效流畅自然，增强体验感

---

## 2. Color Palette & Roles

### 主色系 (Primary Palette)

| Token | Hex | RGB | Role |
|-------|-----|-----|------|
| `--coral` | `#FF6B6B` | 255, 107, 107 | 珊瑚粉 - 主要强调色，热情活泼 |
| `--amber` | `#FFB347` | 255, 179, 71 | 琥珀金 - 温暖点缀，高级感 |
| `--mint` | `#4ECDC4` | 78, 205, 196 | 薄荷绿 - 清新活力，成功状态 |
| `--lavender` | `#A78BFA` | 167, 139, 250 | 薰衣草紫 - 梦幻感，创意表达 |
| `--peach` | `#FF8E72` | 255, 142, 114 | 蜜桃橙 - 温柔亲切 |

### 功能色 (Functional Colors)

| Token | Hex | Role |
|-------|-----|------|
| `--bg-primary` | `#FDFBF7` | 主背景 - 温暖米白 |
| `--bg-secondary` | `#F7F5F0` | 次级背景 |
| `--bg-card` | `#FFFFFF` | 卡片背景 |
| `--text-primary` | `#1A1A2E` | 主要文字 |
| `--text-secondary` | `#6B7280` | 次级文字 |
| `--text-muted` | `#9CA3AF` | 辅助文字 |
| `--border` | `#E8E5E0` | 边框色 |
| `--shadow` | `rgba(255, 107, 107, 0.1)` | 主题阴影 |

### 渐变 (Gradients)

| Name | Hex | Usage |
|------|-----|-------|
| `gradient-coral-amber` | `linear-gradient(135deg, #FF6B6B, #FFB347)` | 主按钮渐变 |
| `gradient-mint-lavender` | `linear-gradient(135deg, #4ECDC4, #A78BFA)` | 成功/完成状态 |
| `gradient-peach-coral` | `linear-gradient(135deg, #FF8E72, #FF6B6B)` | 强调/警示 |
| `gradient-bg` | `radial-gradient(ellipse at 20% 0%, rgba(255, 107, 107, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(78, 205, 196, 0.08) 0%, transparent 50%)` | 页面背景 |

---

## 3. Typography Rules

### 字体家族

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Noto+Serif+SC:wght@400;600;700&display=swap');

--font-display: 'Space Grotesk', system-ui, sans-serif;  /* 英文标题 */
--font-body: 'Noto Serif SC', Georgia, serif;             /* 中文正文 */
--font-mono: 'SF Mono', 'Fira Code', monospace;           /* 代码/人格代号 */
```

### 字体层级

| Level | Size | Weight | Line-height | Usage |
|-------|------|--------|-------------|-------|
| Display | 4rem (64px) | 700 | 1.1 | 首页大标题 |
| H1 | 2.5rem (40px) | 700 | 1.2 | 页面标题 |
| H2 | 1.75rem (28px) | 600 | 1.3 | 区块标题 |
| H3 | 1.25rem (20px) | 600 | 1.4 | 卡片标题 |
| Body | 1rem (16px) | 400 | 1.6 | 正文 |
| Caption | 0.875rem (14px) | 400 | 1.5 | 辅助文字 |
| Small | 0.75rem (12px) | 500 | 1.4 | 标签/徽章 |

---

## 4. Component Stylings

### 按钮 (Buttons)

**Primary Button**
```css
- background: linear-gradient(135deg, #FF6B6B, #FFB347);
- border-radius: 9999px;  /* 全圆角 */
- padding: 16px 32px;
- font-weight: 600;
- color: white;
- box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3);
- transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```
Hover: 向上偏移 2px，阴影加深
Active: 向下偏移 1px，阴影减弱

**Secondary Button**
```css
- background: white;
- border: 2px solid #E8E5E0;
- border-radius: 9999px;
- padding: 14px 30px;
- color: #1A1A2E;
- transition: all 0.2s ease;
```
Hover: 边框变为主题色，边框加粗

**Ghost Button**
```css
- background: transparent;
- border-radius: 9999px;
- padding: 12px 24px;
- color: #6B7280;
```
Hover: 背景变为 #F7F5F0

### 卡片 (Cards)

**Standard Card**
```css
- background: white;
- border-radius: 24px;
- padding: 24px;
- box-shadow: 0 2px 8px rgba(26, 26, 46, 0.04), 
              0 8px 24px rgba(26, 26, 46, 0.06);
- border: 1px solid rgba(232, 229, 224, 0.5);
```

**Elevated Card**
```css
- background: white;
- border-radius: 24px;
- box-shadow: 0 8px 32px rgba(26, 26, 46, 0.08),
              0 24px 48px rgba(26, 26, 46, 0.08);
- transform: translateY(0);
- transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```
Hover: translateY(-4px), 阴影加深

### 输入/选项 (Option Buttons)

**Option Card (答题选项)**
```css
- background: white;
- border: 2px solid #E8E5E0;
- border-radius: 16px;
- padding: 16px 20px;
- min-height: 64px;
- cursor: pointer;
- transition: all 0.2s ease;
```

**Selected State**
```css
- border-color: #FF6B6B;
- background: linear-gradient(135deg, rgba(255, 107, 107, 0.05), rgba(255, 179, 71, 0.05));
- box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.1);
```

### 进度条 (Progress Bar)

```css
- height: 8px;
- background: #F7F5F0;
- border-radius: 9999px;
- overflow: hidden;

- fill: linear-gradient(90deg, #FF6B6B, #FFB347, #4ECDC4);
- transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
```

### 模态框 (Modal)

```css
- background: white;
- border-radius: 32px;
- padding: 32px;
- max-width: 480px;
- box-shadow: 0 24px 64px rgba(26, 26, 46, 0.12),
              0 8px 24px rgba(26, 26, 46, 0.08);
```

---

## 5. Layout Principles

### 间距系统 (Spacing Scale)

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | 4px | 紧凑间距 |
| `--space-sm` | 8px | 小间距 |
| `--space-md` | 16px | 标准间距 |
| `--space-lg` | 24px | 区块间距 |
| `--space-xl` | 32px | 大间距 |
| `--space-2xl` | 48px | 页面内间距 |
| `--space-3xl` | 64px | 区域间距 |

### 容器宽度

```css
- --container-sm: 640px;   /* 答题页 */
- --container-md: 768px;   /* 结果页 */
- --container-lg: 1024px;  /* 图鉴页 */
- --container-xl: 1280px;  /* 最大宽度 */
```

### 圆角系统

```css
- --radius-sm: 8px;
- --radius-md: 16px;
- --radius-lg: 24px;
- --radius-xl: 32px;
- --radius-full: 9999px;  /* 按钮/徽章 */
```

---

## 6. Depth & Elevation

### 阴影层级

| Level | Shadow | Usage |
|-------|--------|-------|
| Subtle | `0 2px 8px rgba(26, 26, 46, 0.04)` | 卡片默认 |
| Medium | `0 4px 16px rgba(26, 26, 46, 0.06)` | 悬停 |
| High | `0 8px 32px rgba(26, 26, 46, 0.08)` | 弹窗 |
| Theme | `0 8px 32px rgba(255, 107, 107, 0.15)` | 主题强调 |

### 边框

```css
- default: 1px solid #E8E5E0;
- hover: 1px solid #D5D2CD;
- active: 2px solid #FF6B6B;
```

---

## 7. Do's and Don'ts

### Do
- 使用渐变色增加活力
- 保持大圆角，友好无攻击性
- 阴影使用主题色 rgba
- 动画流畅自然 (cubic-bezier)
- 字体使用 Space Grotesk + Noto Serif SC

### Don't
- 不要使用深色背景
- 不要使用纯黑文字 (#000)
- 不要使用生硬的边角
- 不要使用过于饱和刺眼的颜色
- 不要使用机械化的动画

---

## 8. Responsive Behavior

### 断点

```css
- sm: 640px
- md: 768px  
- lg: 1024px
- xl: 1280px
```

### 移动端适配
- 卡片 padding 调整为 16px
- 按钮 padding 调整为 14px 24px
- 字体大小整体缩小 10-15%
- 圆角保持不变或略减小

---

## 9. 人格主题色映射

| 人格 | 主题色 |
|-----|--------|
| CTRL | #8B5CF6 (紫) |
| BOSS | #EF4444 (红) |
| MUM | #EC4899 (粉) |
| DEAD | #6B7280 (灰) |
| GOGO | #10B981 (绿) |
| ... | ... |

所有主题色都带柔和渐变和发光效果。

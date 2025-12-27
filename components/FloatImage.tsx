import React from 'react'

interface FloatImageProps {
    src: string
    alt: string
    /** 
     * 布局方式：
     * - left/right: 浮动布局，文字环绕（桌面端）
     * - center: 居中，单独一行
     * - block-left: 靠左，单独一行
     * - block-right: 靠右，单独一行
     */
    align?: 'left' | 'right' | 'center' | 'block-left' | 'block-right'
    /** 最大宽度，单位 px，默认 400 */
    maxWidth?: number
    /** 是否在移动端也保持布局，默认 false（移动端自动单独一行） */
    keepMobileLayout?: boolean
}

export default function FloatImage({
    src,
    alt,
    align = 'right',
    maxWidth = 400,
    keepMobileLayout = false,
}: FloatImageProps) {
    // 根据不同的 align 生成对应的样式
    const getStyles = (): React.CSSProperties => {
        const baseStyles: React.CSSProperties = {
            maxWidth: `${maxWidth}px`,
            width: '100%',
            height: 'auto',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
        }

        // 如果不保持移动端布局，使用媒体查询样式
        if (!keepMobileLayout) {
            // 在移动端，所有图片都是 block，不浮动
            switch (align) {
                case 'left':
                    return {
                        ...baseStyles,
                        display: 'block',
                        // 桌面端使用 float（通过 CSS 类实现响应式）
                    }
                case 'right':
                    return {
                        ...baseStyles,
                        display: 'block',
                    }
                case 'center':
                    return {
                        ...baseStyles,
                        display: 'block',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }
                case 'block-left':
                    return {
                        ...baseStyles,
                        display: 'block',
                        marginRight: 'auto',
                    }
                case 'block-right':
                    return {
                        ...baseStyles,
                        display: 'block',
                        marginLeft: 'auto',
                    }
            }
        }

        // 保持移动端布局或桌面端的样式
        switch (align) {
            case 'left':
                return {
                    ...baseStyles,
                    float: 'left',
                    marginRight: '1rem',
                }
            case 'right':
                return {
                    ...baseStyles,
                    float: 'right',
                    marginLeft: '1rem',
                }
            case 'center':
                return {
                    ...baseStyles,
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }
            case 'block-left':
                return {
                    ...baseStyles,
                    display: 'block',
                    marginRight: 'auto',
                }
            case 'block-right':
                return {
                    ...baseStyles,
                    display: 'block',
                    marginLeft: 'auto',
                }
            default:
                return baseStyles
        }
    }

    // 为响应式浮动添加 className
    const getClassName = () => {
        if (keepMobileLayout) return ''

        switch (align) {
            case 'left':
                return 'float-image-left'
            case 'right':
                return 'float-image-right'
            default:
                return ''
        }
    }

    return (
        <img
            src={src}
            alt={alt}
            className={getClassName()}
            style={getStyles()}
        />
    )
}


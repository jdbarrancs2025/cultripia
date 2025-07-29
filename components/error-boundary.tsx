"use client"

import React, { Component, ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
    
    // Handle ChunkLoadError specifically
    if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
      // Clear module cache and reload
      if ('webpackChunkName' in window) {
        delete (window as any).webpackChunkName
      }
      
      // Attempt to recover by reloading after a short delay
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      const isChunkError = this.state.error?.name === 'ChunkLoadError' || 
                          this.state.error?.message.includes('Loading chunk')

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
          <h2 className="text-xl font-semibold text-gris-90 mb-2">
            {isChunkError ? 'Loading Error' : 'Algo salió mal'}
          </h2>
          <p className="text-gris-80 mb-4 text-center">
            {isChunkError 
              ? 'The application encountered a loading error. Refreshing automatically...'
              : 'Ha ocurrido un error inesperado. Por favor, intenta recargar la página.'}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-turquesa hover:bg-turquesa/90"
          >
            {isChunkError ? 'Refresh Now' : 'Recargar página'}
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
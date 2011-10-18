<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="/">
		<ul>
			<xsl:apply-templates />
		</ul>
	</xsl:template>
	<xsl:template match="symbol">
		<li>
			<span>
				<xsl:attribute name="class">
					<xsl:value-of select="@type" />
				</xsl:attribute>
			</span>

			<xsl:choose>
				<xsl:when test="starts-with(@name, concat(../@name, '.'))">
					<a>
						<xsl:attribute name="href">#<xsl:value-of select="@name" /></xsl:attribute>
						<xsl:attribute name="onclick">app.loadSymbol('<xsl:value-of select="@name"/>')</xsl:attribute>
						<xsl:value-of select="substring-after(@name, concat(../@name, '.'))"/>
					</a>
				</xsl:when>
				<xsl:otherwise>
					<a>
						<xsl:attribute name="href">#<xsl:value-of select="@name" /></xsl:attribute>
						<xsl:attribute name="onclick">app.loadSymbol('<xsl:value-of select="@name"/>')</xsl:attribute>
						<xsl:value-of select="@name"/>
					</a>
				</xsl:otherwise>
			</xsl:choose>

			<ul>
				<xsl:apply-templates/>
			</ul>
		</li>
	</xsl:template>
</xsl:stylesheet>